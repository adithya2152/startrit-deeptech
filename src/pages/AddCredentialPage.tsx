import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const AddCredentialPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [credential, setCredential] = useState({
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/credentials/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-assets')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Error', description: 'Failed to upload file', variant: 'destructive' });
      return;
    }

    const { data } = supabase.storage.from('profile-assets').getPublicUrl(fileName);
    setCredential(prev => ({ ...prev, proof_image_url: data.publicUrl }));
  };

  const handleSubmit = async () => {
    if (!profile) return;

    const { error } = await supabase.from('profile_credentials').insert({
      profile_id: profile.id,
      ...credential,
      expiry_date: credential.does_not_expire ? null : credential.expiry_date
    });

    if (error) {
      toast({ title: 'Error', description: 'Failed to save credential', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Credential added successfully' });
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-xl font-semibold mb-4">Add Credential</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Type *</Label>
          <Select value={credential.type} onValueChange={(val) => setCredential(c => ({ ...c, type: val }))}>
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
          <Label>Title *</Label>
          <Input
            value={credential.title}
            onChange={(e) => setCredential(c => ({ ...c, title: e.target.value }))}
          />
        </div>
        <div>
          <Label>Organization *</Label>
          <Input
            value={credential.organization}
            onChange={(e) => setCredential(c => ({ ...c, organization: e.target.value }))}
          />
        </div>
        <div>
          <Label>Credential ID</Label>
          <Input
            value={credential.credential_id}
            onChange={(e) => setCredential(c => ({ ...c, credential_id: e.target.value }))}
          />
        </div>
        <div>
          <Label>Issue Date *</Label>
          <Input
            type="date"
            value={credential.issue_date}
            onChange={(e) => setCredential(c => ({ ...c, issue_date: e.target.value }))}
          />
        </div>
        <div>
          <Label>Expiry Date</Label>
          <Input
            type="date"
            value={credential.expiry_date}
            onChange={(e) => setCredential(c => ({ ...c, expiry_date: e.target.value }))}
            disabled={credential.does_not_expire}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          id="does_not_expire"
          checked={credential.does_not_expire}
          onCheckedChange={(checked) =>
            setCredential(c => ({ ...c, does_not_expire: !!checked, expiry_date: checked ? '' : c.expiry_date }))
          }
        />
        <Label htmlFor="does_not_expire">Does not expire</Label>
      </div>
      <div className="mt-4">
        <Label>Description</Label>
        <Textarea
          value={credential.description}
          onChange={(e) => setCredential(c => ({ ...c, description: e.target.value }))}
        />
      </div>
      <div className="mt-4">
        <Label>Credential Link</Label>
        <Input
          value={credential.credential_link}
          onChange={(e) => setCredential(c => ({ ...c, credential_link: e.target.value }))}
        />
      </div>
      <div className="mt-4">
        <Label>Proof Image</Label>
        <div className="flex items-center space-x-4">
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Proof
          </Button>
          {credential.proof_image_url && <span className="text-sm text-green-600">Image uploaded</span>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      <Button className="mt-6" onClick={handleSubmit}>
        Save Credential
      </Button>
    </div>
  );
};

export default AddCredentialPage;
