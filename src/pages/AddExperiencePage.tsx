import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AddExperiencePage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { toast } = useToast();

  const [experience, setExperience] = useState({
    title: '',
    company: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
  });

  const handleSubmit = async () => {
    if (!experience.title || !experience.company || !experience.start_date) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!profile) {
      toast({
        title: 'Error',
        description: 'User profile not found',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('profile_experience').insert({
      profile_id: profile.id,
      title: experience.title,
      company: experience.company,
      description: experience.description,
      start_date: experience.start_date,
      end_date: experience.is_current ? null : experience.end_date,
      is_current: experience.is_current,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save experience',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Experience added successfully',
    });

    // Redirect to experience list or profile page — change path if needed
    navigate('/profile-setup/4');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Work Experience</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={experience.title}
            onChange={(e) => setExperience(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        <div>
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={experience.company}
            onChange={(e) => setExperience(prev => ({ ...prev, company: e.target.value }))}
            placeholder="e.g., Google, Microsoft"
          />
        </div>
        <div>
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={experience.start_date}
            onChange={(e) => setExperience(prev => ({ ...prev, start_date: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={experience.end_date}
            onChange={(e) => setExperience(prev => ({ ...prev, end_date: e.target.value }))}
            disabled={experience.is_current}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          id="is_current"
          checked={experience.is_current}
          onCheckedChange={(checked) =>
            setExperience(prev => ({
              ...prev,
              is_current: !!checked,
              end_date: checked ? '' : prev.end_date,
            }))
          }
        />
        <Label htmlFor="is_current">Currently working here</Label>
      </div>

      <div className="mt-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={experience.description}
          onChange={(e) => setExperience(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your role and achievements..."
          className="mt-1"
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="mt-6"
        disabled={!experience.title || !experience.company || !experience.start_date}
      >
        <Plus className="w-4 h-4 mr-2" />
        Save Experience
      </Button>
    </div>
  );
};

export default AddExperiencePage;
