
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

interface Education {
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

const ProfileSetup6 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  
  const [educations, setEducations] = useState<Education[]>([]);
  const [newEducation, setNewEducation] = useState<Education>({
    school: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: ''
  });

  useEffect(() => {
    if (profile) {
      fetchEducations();
    }
  }, [profile]);

  const fetchEducations = async () => {
    if (!profile) return;
    
    const { data, error } = await supabase
      .from('profile_education')
      .select('*')
      .eq('profile_id', profile.id)
      .order('start_date', { ascending: false });

    if (!error && data) {
      setEducations(data.map(edu => ({
        school: edu.school,
        degree: edu.degree,
        field_of_study: edu.field_of_study,
        start_date: edu.start_date,
        end_date: edu.end_date || '',
        is_current: edu.is_current || false,
        description: edu.description || ''
      })));
    }
  };

  const addEducation = () => {
    if (!newEducation.school || !newEducation.degree || !newEducation.field_of_study || !newEducation.start_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setEducations(prev => [...prev, newEducation]);
    setNewEducation({
      school: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: ''
    });
  };

  const removeEducation = (index: number) => {
    setEducations(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (educations.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one education entry",
        variant: "destructive",
      });
      return;
    }

    // Update profile step
    const { error: profileError } = await updateProfile({
      setup_step: 7
    });

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to save profile information",
        variant: "destructive",
      });
      return;
    }

    // Delete existing education
    await supabase
      .from('profile_education')
      .delete()
      .eq('profile_id', profile?.id);

    // Insert new education
    if (educations.length > 0) {
      const educationData = educations.map(edu => ({
        profile_id: profile?.id,
        school: edu.school,
        degree: edu.degree,
        field_of_study: edu.field_of_study,
        start_date: edu.start_date,
        end_date: edu.is_current ? null : edu.end_date,
        is_current: edu.is_current,
        description: edu.description
      }));

      const { error: eduError } = await supabase
        .from('profile_education')
        .insert(educationData);

      if (eduError) {
        toast({
          title: "Error",
          description: "Failed to save education information",
          variant: "destructive",
        });
        return;
      }
    }

    navigate('/profile-setup/7');
  };

  const handleBack = () => {
    navigate('/profile-setup/5');
  };

  return (
    <ProfileSetupLayout
      step={6}
      title="Education"
      description="Add your educational background to showcase your qualifications."
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={educations.length === 0}
    >
      <div className="space-y-6">
        {/* Add Education Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Add Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="school">School / University *</Label>
              <Input
                id="school"
                value={newEducation.school}
                onChange={(e) => setNewEducation(prev => ({ ...prev, school: e.target.value }))}
                placeholder="e.g., Stanford University"
              />
            </div>
            <div>
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                value={newEducation.degree}
                onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                placeholder="e.g., Bachelor of Science"
              />
            </div>
            <div>
              <Label htmlFor="field_of_study">Field of Study *</Label>
              <Input
                id="field_of_study"
                value={newEducation.field_of_study}
                onChange={(e) => setNewEducation(prev => ({ ...prev, field_of_study: e.target.value }))}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="edu_start_date">Start Date *</Label>
              <Input
                id="edu_start_date"
                type="date"
                value={newEducation.start_date}
                onChange={(e) => setNewEducation(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edu_end_date">End Date</Label>
              <Input
                id="edu_end_date"
                type="date"
                value={newEducation.end_date}
                onChange={(e) => setNewEducation(prev => ({ ...prev, end_date: e.target.value }))}
                disabled={newEducation.is_current}
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edu_is_current"
                checked={newEducation.is_current}
                onCheckedChange={(checked) => setNewEducation(prev => ({ 
                  ...prev, 
                  is_current: !!checked,
                  end_date: checked ? '' : prev.end_date
                }))}
              />
              <Label htmlFor="edu_is_current">Currently studying here</Label>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="edu_description">Description</Label>
            <Textarea
              id="edu_description"
              value={newEducation.description}
              onChange={(e) => setNewEducation(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details about your studies..."
              className="mt-1"
            />
          </div>
          <Button
            type="button"
            onClick={addEducation}
            className="mt-4"
            disabled={!newEducation.school || !newEducation.degree || !newEducation.field_of_study || !newEducation.start_date}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>

        {/* Education List */}
        <div className="space-y-4">
          {educations.map((edu, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{edu.degree} in {edu.field_of_study}</h4>
                  <p className="text-gray-600">{edu.school}</p>
                  <p className="text-sm text-gray-500">
                    {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                  </p>
                  {edu.description && (
                    <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {educations.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No education added yet. Add your first education entry above.
          </p>
        )}
      </div>
    </ProfileSetupLayout>
  );
};

export default ProfileSetup6;
