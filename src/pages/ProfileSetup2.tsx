
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import ProfileSetupLayout from '@/components/ProfileSetupLayout';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Language {
  name: string;
  proficiency: string;
}

const ProfileSetup2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  
  const [formData, setFormData] = useState({
    languages: [] as Language[],
    dateOfBirth: '',
    gender: ''
  });

  const [newLanguage, setNewLanguage] = useState({ name: '', proficiency: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        languages: [],
        dateOfBirth: profile.date_of_birth || '',
        gender: profile.gender || ''
      });
      fetchLanguages();
    }
  }, [profile]);

  const fetchLanguages = async () => {
    if (!profile) return;
    
    const { data, error } = await supabase
      .from('profile_languages')
      .select('*')
      .eq('profile_id', profile.id);

    if (!error && data) {
      setFormData(prev => ({
        ...prev,
        languages: data.map(lang => ({
          name: lang.language_name,
          proficiency: lang.proficiency
        }))
      }));
    }
  };

  const addLanguage = () => {
    if (newLanguage.name && newLanguage.proficiency) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage({ name: '', proficiency: '' });
    }
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleNext = async () => {
    if (formData.languages.length === 0 || !formData.dateOfBirth || !formData.gender) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Update profile basic info
    const { error: profileError } = await updateProfile({
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      setup_step: 3
    });

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to save profile information",
        variant: "destructive",
      });
      return;
    }

    // Delete existing languages
    await supabase
      .from('profile_languages')
      .delete()
      .eq('profile_id', profile?.id);

    // Insert new languages
    if (formData.languages.length > 0) {
      const languageData = formData.languages.map(lang => ({
        profile_id: profile?.id,
        language_name: lang.name,
        proficiency: lang.proficiency
      }));

      const { error: langError } = await supabase
        .from('profile_languages')
        .insert(languageData);

      if (langError) {
        toast({
          title: "Error",
          description: "Failed to save language information",
          variant: "destructive",
        });
        return;
      }
    }

    navigate('/profile-setup/3');
  };

  const handleBack = () => {
    navigate('/profile-setup/1');
  };

  const isValid = formData.languages.length > 0 && formData.dateOfBirth && formData.gender;

  return (
    <ProfileSetupLayout
      step={2}
      title="Language & Personal Info"
      description="Tell us about your language skills and some personal details."
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!isValid}
    >
      <div className="space-y-6">
        {/* Languages */}
        <div>
          <Label className="text-base font-semibold">Languages *</Label>
          <p className="text-sm text-gray-600 mb-4">Add the languages you speak</p>
          
          {/* Add Language Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Language name (e.g., English)"
              value={newLanguage.name}
              onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
            />
            <Select
              value={newLanguage.proficiency}
              onValueChange={(value) => setNewLanguage(prev => ({ ...prev, proficiency: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Proficiency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Native">Native</SelectItem>
                <SelectItem value="Fluent">Fluent</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={addLanguage}
              disabled={!newLanguage.name || !newLanguage.proficiency}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Language List */}
          <div className="space-y-2">
            {formData.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span>{lang.name} - {lang.proficiency}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            className="mt-1"
          />
        </div>

        {/* Gender */}
        <div>
          <Label>Gender *</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-gray-500">
          * Required fields. Add at least one language with proficiency level.
        </p>
      </div>
    </ProfileSetupLayout>
  );
};

export default ProfileSetup2;
