
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import ProfileSetupLayout from '@/components/ProfileSetupLayout';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  title: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

const ProfileSetup4 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExperience, setNewExperience] = useState<Experience>({
    title: '',
    company: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false
  });

  useEffect(() => {
    if (profile) {
      fetchExperiences();
    }
  }, [profile]);

  const fetchExperiences = async () => {
    if (!profile) return;
    
    const { data, error } = await supabase
      .from('profile_experience')
      .select('*')
      .eq('profile_id', profile.id)
      .order('start_date', { ascending: false });

    if (!error && data) {
      setExperiences(data.map(exp => ({
        title: exp.title,
        company: exp.company,
        description: exp.description || '',
        start_date: exp.start_date,
        end_date: exp.end_date || '',
        is_current: exp.is_current || false
      })));
    }
  };

  const addExperience = () => {
    if (!newExperience.title || !newExperience.company || !newExperience.start_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setExperiences(prev => [...prev, newExperience]);
    setNewExperience({
      title: '',
      company: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false
    });
  };

  const removeExperience = (index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (experiences.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one work experience",
        variant: "destructive",
      });
      return;
    }

    // Update profile step
    const { error: profileError } = await updateProfile({
      setup_step: 5
    });

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to save profile information",
        variant: "destructive",
      });
      return;
    }

    // Delete existing experiences
    await supabase
      .from('profile_experience')
      .delete()
      .eq('profile_id', profile?.id);

    // Insert new experiences
    if (experiences.length > 0) {
      const experienceData = experiences.map(exp => ({
        profile_id: profile?.id,
        title: exp.title,
        company: exp.company,
        description: exp.description,
        start_date: exp.start_date,
        end_date: exp.is_current ? null : exp.end_date,
        is_current: exp.is_current
      }));

      const { error: expError } = await supabase
        .from('profile_experience')
        .insert(experienceData);

      if (expError) {
        toast({
          title: "Error",
          description: "Failed to save experience information",
          variant: "destructive",
        });
        return;
      }
    }

    navigate('/profile-setup/5');
  };

  const handleBack = () => {
    navigate('/profile-setup/3');
  };

  return (
    <ProfileSetupLayout
      step={4}
      title="Work Experience"
      description="Add your relevant work experience to show your expertise."
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={experiences.length === 0}
    >
      <div className="space-y-6">
        {/* Add Experience Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Add Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={newExperience.title}
                onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={newExperience.company}
                onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g., Google, Microsoft"
              />
            </div>
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={newExperience.start_date}
                onChange={(e) => setNewExperience(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={newExperience.end_date}
                onChange={(e) => setNewExperience(prev => ({ ...prev, end_date: e.target.value }))}
                disabled={newExperience.is_current}
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_current"
                checked={newExperience.is_current}
                onCheckedChange={(checked) => setNewExperience(prev => ({ 
                  ...prev, 
                  is_current: !!checked,
                  end_date: checked ? '' : prev.end_date
                }))}
              />
              <Label htmlFor="is_current">Currently working here</Label>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newExperience.description}
              onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your role and achievements..."
              className="mt-1"
            />
          </div>
          <Button
            type="button"
            onClick={addExperience}
            className="mt-4"
            disabled={!newExperience.title || !newExperience.company || !newExperience.start_date}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {/* Experience List */}
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{exp.title}</h4>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {experiences.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No experience added yet. Add your first experience above.
          </p>
        )}
      </div>
    </ProfileSetupLayout>
  );
};

export default ProfileSetup4;
