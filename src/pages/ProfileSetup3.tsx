
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProfileSetupLayout from '@/components/ProfileSetupLayout';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

const ProfileSetup3 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  
  const [formData, setFormData] = useState({
    title: '',
    bio: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleNext = async () => {
    if (!formData.title.trim() || formData.bio.length < 100 || formData.bio.length > 1000) {
      toast({
        title: "Error",
        description: "Please fill in all required fields. Bio must be between 100-1000 characters.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await updateProfile({
      title: formData.title,
      bio: formData.bio,
      setup_step: 4
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save profile information",
        variant: "destructive",
      });
      return;
    }

    navigate('/profile-setup/4');
  };

  const handleBack = () => {
    navigate('/profile-setup/2');
  };

  const isValid = formData.title.trim() && formData.bio.length >= 100 && formData.bio.length <= 1000;

  return (
    <ProfileSetupLayout
      step={3}
      title="About You"
      description="Tell us about your professional role and background."
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!isValid}
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">What do you do? *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., AI/ML Engineer, Full Stack Developer"
            className="mt-1"
          />
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio / About Description *</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Describe your background, strengths, and passion..."
            className="mt-1 min-h-[120px]"
            maxLength={1000}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.bio.length}/1000 characters (minimum 100 required)
          </p>
        </div>

        <p className="text-sm text-gray-500">
          * Required fields. Bio must be between 100-1000 characters.
        </p>
      </div>
    </ProfileSetupLayout>
  );
};

export default ProfileSetup3;
