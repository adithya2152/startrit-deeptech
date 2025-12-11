import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus } from 'lucide-react';

const AddEducationPage = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [education, setEducation] = useState({
    school: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: ''
  });

  const handleSubmit = async () => {
    if (!education.school || !education.degree || !education.field_of_study || !education.start_date) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const { error } = await supabase.from('profile_education').insert([
      {
        profile_id: profile?.id,
        ...education,
        end_date: education.is_current ? null : education.end_date
      }
    ]);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save education.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Education added successfully.',
    });

    navigate(-1); // Go back
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Add Education</h2>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="school">School / University *</Label>
          <Input
            id="school"
            value={education.school}
            onChange={(e) => setEducation((prev) => ({ ...prev, school: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="degree">Degree *</Label>
          <Input
            id="degree"
            value={education.degree}
            onChange={(e) => setEducation((prev) => ({ ...prev, degree: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="field">Field of Study *</Label>
          <Input
            id="field"
            value={education.field_of_study}
            onChange={(e) => setEducation((prev) => ({ ...prev, field_of_study: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="start">Start Date *</Label>
          <Input
            id="start"
            type="date"
            value={education.start_date}
            onChange={(e) => setEducation((prev) => ({ ...prev, start_date: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="end">End Date</Label>
          <Input
            id="end"
            type="date"
            value={education.end_date}
            onChange={(e) => setEducation((prev) => ({ ...prev, end_date: e.target.value }))}
            disabled={education.is_current}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          id="is_current"
          checked={education.is_current}
          onCheckedChange={(checked) =>
            setEducation((prev) => ({
              ...prev,
              is_current: !!checked,
              end_date: checked ? '' : prev.end_date
            }))
          }
        />
        <Label htmlFor="is_current">Currently studying here</Label>
      </div>

      <div className="mt-4">
        <Label htmlFor="desc">Description</Label>
        <Textarea
          id="desc"
          placeholder="Additional info..."
          value={education.description}
          onChange={(e) => setEducation((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <Button className="mt-6" onClick={handleSubmit}>
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
};

export default AddEducationPage;
