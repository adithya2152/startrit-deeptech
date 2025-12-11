import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import ProfileSetupLayout from '@/components/ProfileSetupLayout';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialLinks {
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  other_links: string[];
}

const ProfileSetup8 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    other_links: []
  });
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    if (profile) {
      fetchSocialLinks();
    }
  }, [profile]);

  const fetchSocialLinks = async () => {
    if (!profile) return;
    
    const { data, error } = await supabase
      .from('profile_social_links')
      .select('*')
      .eq('profile_id', profile.id)
      .single();

    if (!error && data) {
      setSocialLinks({
        linkedin: data.linkedin || '',
        github: data.github || '',
        twitter: data.twitter || '',
        website: data.website || '',
        other_links: data.other_links || []
      });
    }
  };

  const addOtherLink = () => {
    if (newLink.trim()) {
      // Basic URL validation
      if (!newLink.startsWith('http://') && !newLink.startsWith('https://')) {
        toast({
          title: "Error",
          description: "Please enter a valid URL starting with http:// or https://",
          variant: "destructive",
        });
        return;
      }

      setSocialLinks(prev => ({
        ...prev,
        other_links: [...prev.other_links, newLink.trim()]
      }));
      setNewLink('');
    }
  };

  const removeOtherLink = (index: number) => {
    setSocialLinks(prev => ({
      ...prev,
      other_links: prev.other_links.filter((_, i) => i !== index)
    }));
  };

  const validateUrl = (url: string) => {
    if (!url) return true; // Empty URLs are allowed
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const handleNext = async () => {
    // Validate URLs
    const urlFields = [
      { name: 'LinkedIn', value: socialLinks.linkedin },
      { name: 'GitHub', value: socialLinks.github },
      { name: 'Twitter', value: socialLinks.twitter },
      { name: 'Website', value: socialLinks.website }
    ];

    for (const field of urlFields) {
      if (field.value && !validateUrl(field.value)) {
        toast({
          title: "Error",
          description: `${field.name} URL must start with http:// or https://`,
          variant: "destructive",
        });
        return;
      }
    }

    // Update profile step
    const { error: profileError } = await updateProfile({
      setup_step: 9
    });

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to save profile information",
        variant: "destructive",
      });
      return;
    }

    // Delete existing social links
    await supabase
      .from('profile_social_links')
      .delete()
      .eq('profile_id', profile?.id);

    // Insert new social links
    const socialData = {
      profile_id: profile?.id,
      linkedin: socialLinks.linkedin || null,
      github: socialLinks.github || null,
      twitter: socialLinks.twitter || null,
      website: socialLinks.website || null,
      other_links: socialLinks.other_links.length > 0 ? socialLinks.other_links : null
    };

    const { error: socialError } = await supabase
      .from('profile_social_links')
      .insert(socialData);

    if (socialError) {
      toast({
        title: "Error",
        description: "Failed to save social links information",
        variant: "destructive",
      });
      return;
    }

    navigate('/profile-setup/9');
  };

  const handleBack = () => {
    navigate('/profile-setup/7');
  };

  return (
    <ProfileSetupLayout
      step={8}
      title="Social Media Links"
      description="Add your professional social media profiles and portfolio links (all optional)."
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-6">
        {/* Main Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              value={socialLinks.linkedin}
              onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/yourprofile"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="github">GitHub Profile</Label>
            <Input
              id="github"
              value={socialLinks.github}
              onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
              placeholder="https://github.com/yourusername"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter Profile</Label>
            <Input
              id="twitter"
              value={socialLinks.twitter}
              onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
              placeholder="https://twitter.com/yourusername"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              value={socialLinks.website}
              onChange={(e) => setSocialLinks(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://yourwebsite.com"
              className="mt-1"
            />
          </div>
        </div>

        {/* Other Links */}
        <div>
          <Label>Other Links</Label>
          <p className="text-sm text-gray-600 mb-3">Add any other relevant links (portfolio, blog, etc.)</p>
          
          <div className="flex space-x-2 mb-3">
            <Input
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="https://..."
              onKeyPress={(e) => e.key === 'Enter' && addOtherLink()}
            />
            <Button
              type="button"
              onClick={addOtherLink}
              disabled={!newLink.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Other Links List */}
          <div className="space-y-2">
            {socialLinks.other_links.map((link, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 truncate"
                >
                  {link}
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOtherLink(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Why add social links?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Helps clients verify your credibility and expertise</li>
            <li>• Showcases your work and projects</li>
            <li>• Builds trust with potential clients</li>
            <li>• Demonstrates your professional network</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          All social media links are optional. You can skip this step and add them later if needed.
        </p>
      </div>
    </ProfileSetupLayout>
  );
};

export default ProfileSetup8;
