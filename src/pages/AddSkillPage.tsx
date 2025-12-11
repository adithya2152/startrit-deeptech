import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const domains = [
  'AI/Machine Learning', 'Web Development', 'Mobile Development', 'Data Science',
  'DevOps', 'Cybersecurity', 'Blockchain', 'Game Development', 'UI/UX Design', 'Cloud Computing'
];

const subdomains: { [key: string]: string[] } = {
  'AI/Machine Learning': ['Deep Learning', 'Computer Vision', 'NLP', 'Reinforcement Learning', 'MLOps'],
  'Web Development': ['Frontend', 'Backend', 'Full Stack', 'API Development', 'E-commerce'],
  'Mobile Development': ['iOS', 'Android', 'React Native', 'Flutter', 'Cross-platform'],
  'Data Science': ['Data Analysis', 'Data Visualization', 'Statistical Modeling', 'Big Data', 'ETL'],
  'DevOps': ['CI/CD', 'Infrastructure', 'Monitoring', 'Containerization', 'Automation'],
  'Cybersecurity': ['Penetration Testing', 'Security Audit', 'Incident Response', 'Compliance', 'Risk Assessment'],
  'Blockchain': ['Smart Contracts', 'DeFi', 'NFTs', 'Cryptocurrency', 'Web3'],
  'Game Development': ['Unity', 'Unreal Engine', '2D Games', '3D Games', 'Mobile Games'],
  'UI/UX Design': ['User Research', 'Prototyping', 'Visual Design', 'Interaction Design', 'Design Systems'],
  'Cloud Computing': ['AWS', 'Azure', 'Google Cloud', 'Serverless', 'Microservices']
};

const AddSkillPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { toast } = useToast();

  const [domain, setDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skillNames, setSkillNames] = useState<string[]>([]);

  const addSkillName = () => {
    if (skillInput.trim() && !skillNames.includes(skillInput.trim())) {
      setSkillNames([...skillNames, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkillName = (index: number) => {
    setSkillNames(skillNames.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!domain || skillNames.length === 0 || !profile) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('profile_skills').insert({
      profile_id: profile.id,
      domain,
      subdomain,
      skill_names: skillNames,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save skill set.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Skill set added successfully.',
      });
      navigate('/profile'); // Change this route to your actual profile page
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Skill Set</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Domain *</Label>
          <Select value={domain} onValueChange={(value) => {
            setDomain(value);
            setSubdomain('');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select Domain" />
            </SelectTrigger>
            <SelectContent>
              {domains.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Subdomain</Label>
          <Select value={subdomain} onValueChange={setSubdomain} disabled={!domain}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subdomain (optional)" />
            </SelectTrigger>
            <SelectContent>
              {domain && subdomains[domain]?.map(sd => (
                <SelectItem key={sd} value={sd}>{sd}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <Label>Skills *</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g. React, AWS"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillName())}
          />
          <Button onClick={addSkillName} disabled={!skillInput.trim()}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {skillNames.map((skill, index) => (
            <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              {skill}
              <button
                type="button"
                onClick={() => removeSkillName(index)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!domain || skillNames.length === 0}
      >
        <Plus className="w-4 h-4 mr-2" />
        Save Skill Set
      </Button>
    </div>
  );
};

export default AddSkillPage;
