
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Upload } from 'lucide-react';
import ProfileSetupLayout from '@/components/ProfileSetupLayout';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRef } from 'react';

interface Credential {
  type: string;
  title: string;
  organization: string;
  credential_id: string;
  issue_date: string;
  expiry_date: string;
  does_not_expire: boolean;
  description: string;
  proof_image_url: string;
  credential_link: string;
}

const ProfileSetup5 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [newCredential, setNewCredential] = useState<Credential>({
    type: '',
    title: '',
    organization: '',
    credential_id: '',
    issue_date: '',
    expiry_date: '',
    does_not_expire: false,
    description: '',
    proof_image_url: '',
    credential_link: ''
  });

  useEffect(() => {
    if (profile) {
      fetchCredentials();
    }
  }, [profile]);

  const fetchCredentials = async () => {
    if (!profile) return;
    
    const { data, error } = await supabase
      .from('profile_credentials')
      .select('*')
      .eq('profile_id', profile.id)
      .order('issue_date', { ascending: false });

    if (!error && data) {
      setCredentials(data.map(cred => ({
        type: cred.type,
        title: cred.title,
        organization: cred.organization,
        credential_id: cred.credential_id || '',
        issue_date: cred.issue_date,
        expiry_date: cred.expiry_date || '',
        does_not_expire: cred.does_not_expire || false,
        description: cred.description || '',
        proof_image_url: cred.proof_image_url || '',
        credential_link: cred.credential_link || ''
      })));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/credentials/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-assets')
        .upload(fileName, file);

      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload proof image",
          variant: "destructive",
        });
        return;
      }

      const { data } = supabase.storage
        .from('profile-assets')
        .getPublicUrl(fileName);

      setNewCredential(prev => ({
        ...prev,
        proof_image_url: data.publicUrl
      }));
    }
  };

  const addCredential = () => {
    if (!newCredential.type || !newCredential.title || !newCredential.organization || !newCredential.issue_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setCredentials(prev => [...prev, newCredential]);
    setNewCredential({
      type: '',
      title: '',
      organization: '',
      credential_id: '',
      issue_date: '',
      expiry_date: '',
      does_not_expire: false,
      description: '',
      proof_image_url: '',
      credential_link: ''
    });
  };

  const removeCredential = (index: number) => {
    setCredentials(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    // Update profile step
    const { error: profileError } = await updateProfile({
      setup_step: 6
    });

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to save profile information",
        variant: "destructive",
      });
      return;
    }

    // Delete existing credentials
    await supabase
      .from('profile_credentials')
      .delete()
      .eq('profile_id', profile?.id);

    // Insert new credentials
    if (credentials.length > 0) {
      const credentialData = credentials.map(cred => ({
        profile_id: profile?.id,
        type: cred.type,
        title: cred.title,
        organization: cred.organization,
        credential_id: cred.credential_id,
        issue_date: cred.issue_date,
        expiry_date: cred.does_not_expire ? null : cred.expiry_date,
        does_not_expire: cred.does_not_expire,
        description: cred.description,
        proof_image_url: cred.proof_image_url,
        credential_link: cred.credential_link
      }));

      const { error: credError } = await supabase
        .from('profile_credentials')
        .insert(credentialData);

      if (credError) {
        toast({
          title: "Error",
          description: "Failed to save credential information",
          variant: "destructive",
        });
        return;
      }
    }

    navigate('/profile-setup/6');
  };

  const handleBack = () => {
    navigate('/profile-setup/4');
  };

  return (
    <ProfileSetupLayout
      step={5}
      title="Credentials"
      description="Add your certifications, licenses, or patents to showcase your qualifications."
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="space-y-6">
        {/* Add Credential Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Add Credential</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Type *</Label>
              <Select
                value={newCredential.type}
                onValueChange={(value) => setNewCredential(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select credential type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certification">Certification</SelectItem>
                  <SelectItem value="License">License</SelectItem>
                  <SelectItem value="Patent">Patent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cred_title">Title *</Label>
              <Input
                id="cred_title"
                value={newCredential.title}
                onChange={(e) => setNewCredential(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., AWS Solutions Architect"
              />
            </div>
            <div>
              <Label htmlFor="organization">Organization *</Label>
              <Input
                id="organization"
                value={newCredential.organization}
                onChange={(e) => setNewCredential(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="e.g., Amazon Web Services"
              />
            </div>
            <div>
              <Label htmlFor="credential_id">Credential ID</Label>
              <Input
                id="credential_id"
                value={newCredential.credential_id}
                onChange={(e) => setNewCredential(prev => ({ ...prev, credential_id: e.target.value }))}
                placeholder="Optional credential ID"
              />
            </div>
            <div>
              <Label htmlFor="issue_date">Issue Date *</Label>
              <Input
                id="issue_date"
                type="date"
                value={newCredential.issue_date}
                onChange={(e) => setNewCredential(prev => ({ ...prev, issue_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={newCredential.expiry_date}
                onChange={(e) => setNewCredential(prev => ({ ...prev, expiry_date: e.target.value }))}
                disabled={newCredential.does_not_expire}
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="does_not_expire"
                checked={newCredential.does_not_expire}
                onCheckedChange={(checked) => setNewCredential(prev => ({ 
                  ...prev, 
                  does_not_expire: !!checked,
                  expiry_date: checked ? '' : prev.expiry_date
                }))}
              />
              <Label htmlFor="does_not_expire">Does not expire</Label>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="cred_description">Description</Label>
            <Textarea
              id="cred_description"
              value={newCredential.description}
              onChange={(e) => setNewCredential(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the credential..."
              className="mt-1"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="credential_link">Credential Link</Label>
            <Input
              id="credential_link"
              value={newCredential.credential_link}
              onChange={(e) => setNewCredential(prev => ({ ...prev, credential_link: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className="mt-4">
            <Label>Proof Image</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Proof
              </Button>
              {newCredential.proof_image_url && (
                <span className="text-sm text-green-600">Image uploaded</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <Button
            type="button"
            onClick={addCredential}
            className="mt-4"
            disabled={!newCredential.type || !newCredential.title || !newCredential.organization || !newCredential.issue_date}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Credential
          </Button>
        </div>

        {/* Credentials List */}
        <div className="space-y-4">
          {credentials.map((cred, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{cred.type}</span>
                  </div>
                  <h4 className="font-semibold mt-2">{cred.title}</h4>
                  <p className="text-gray-600">{cred.organization}</p>
                  <p className="text-sm text-gray-500">
                    Issued: {cred.issue_date} {cred.does_not_expire ? '(No expiry)' : cred.expiry_date ? `- Expires: ${cred.expiry_date}` : ''}
                  </p>
                  {cred.description && (
                    <p className="text-sm text-gray-700 mt-2">{cred.description}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCredential(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {credentials.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No credentials added yet. Credentials are optional but help showcase your qualifications.
          </p>
        )}
      </div>
    </ProfileSetupLayout>
  );
};

export default ProfileSetup5;
