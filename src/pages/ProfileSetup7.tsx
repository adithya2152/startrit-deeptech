
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

interface Skill {
  domain: string;
  subdomain: string;
  skill_names: string[];
}

const domains = [
  'AI/Machine Learning',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'DevOps',
  'Cybersecurity',
  'Blockchain',
  'Game Development',
  'UI/UX Design',
  'Cloud Computing'
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

const ProfileSetup7 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Skill>({
    domain: '',
    subdomain: '',
    skill_names: []
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (profile) {
      fetchSkills();
    }
  }, [profile]);

  const fetchSkills = async () => {
    if (!profile) return;
    
    const { data, error } = await supabase
      .from('profile_skills')
      .select('*')
      .eq('profile_id', profile.id);

    if (!error && data) {
      setSkills(data.map(skill => ({
        domain: skill.domain,
        subdomain: skill.subdomain || '',
        skill_names: skill.skill_names
      })));
    }
  };

  const addSkillName = () => {
    if (skillInput.trim()) {
      setNewSkill(prev => ({
        ...prev,
        skill_names: [...prev.skill_names, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkillName = (index: number) => {
    setNewSkill(prev => ({
      ...prev,
      skill_names: prev.skill_names.filter((_, i) => i !== index)
    }));
  };

  const addSkillSet = () => {
    if (!newSkill.domain || newSkill.skill_names.length === 0) {
      toast({
        title: "Error",
        description: "Please select a domain and add at least one skill",
        variant: "destructive",
      });
      return;
    }

    setSkills(prev => [...prev, newSkill]);
    setNewSkill({
      domain: '',
      subdomain: '',
      skill_names: []
    });
  };

  const removeSkillSet = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (skills.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one skill set",
        variant: "destructive",
      });
      return;
    }

    // Update profile step
    const { error: profileError } = await updateProfile({
      setup_step: 8
    });

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to save profile information",
        variant: "destructive",
      });
      return;
    }

    // Delete existing skills
    await supabase
      .from('profile_skills')
      .delete()
      .eq('profile_id', profile?.id);

    // Insert new skills
    if (skills.length > 0) {
      const skillData = skills.map(skill => ({
        profile_id: profile?.id,
        domain: skill.domain,
        subdomain: skill.subdomain,
        skill_names: skill.skill_names
      }));

      const { error: skillError } = await supabase
        .from('profile_skills')
        .insert(skillData);

      if (skillError) {
        toast({
          title: "Error",
          description: "Failed to save skills information",
          variant: "destructive",
        });
        return;
      }
    }

    navigate('/profile-setup/8');
  };

  const handleBack = () => {
    navigate('/profile-setup/6');
  };

  return (
    <ProfileSetupLayout
      step={7}
      title="Skills & Expertise"
      description="Define your technical skills and areas of expertise."
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={skills.length === 0}
    >
      <div className="space-y-6">
        {/* Add Skills Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Add Skill Set</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Domain *</Label>
              <Select
                value={newSkill.domain}
                onValueChange={(value) => setNewSkill(prev => ({ ...prev, domain: value, subdomain: '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map(domain => (
                    <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subdomain</Label>
              <Select
                value={newSkill.subdomain}
                onValueChange={(value) => setNewSkill(prev => ({ ...prev, subdomain: value }))}
                disabled={!newSkill.domain}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subdomain (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {newSkill.domain && subdomains[newSkill.domain]?.map(subdomain => (
                    <SelectItem key={subdomain} value={subdomain}>{subdomain}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label>Skills *</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Enter a skill (e.g., React, Python, AWS)"
                onKeyPress={(e) => e.key === 'Enter' && addSkillName()}
              />
              <Button
                type="button"
                onClick={addSkillName}
                disabled={!skillInput.trim()}
              >
                Add
              </Button>
            </div>
            
            {/* Skills List */}
            <div className="flex flex-wrap gap-2 mt-3">
              {newSkill.skill_names.map((skill, index) => (
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
            type="button"
            onClick={addSkillSet}
            className="mt-4"
            disabled={!newSkill.domain || newSkill.skill_names.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill Set
          </Button>
        </div>

        {/* Skills List */}
        <div className="space-y-4">
          {skills.map((skillSet, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">{skillSet.domain}</span>
                    {skillSet.subdomain && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{skillSet.subdomain}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillSet.skill_names.map((skill, skillIndex) => (
                      <span key={skillIndex} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkillSet(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No skills added yet. Add your first skill set above.
          </p>
        )}
      </div>
    </ProfileSetupLayout>
  );
};

export default ProfileSetup7;
