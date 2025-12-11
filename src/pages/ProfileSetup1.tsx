
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import ProfileSetupLayout from '@/components/ProfileSetupLayout';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ProfileSetup1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profilePicture: null as File | null,
    profilePictureUrl: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        profilePicture: null,
        profilePictureUrl: profile.profile_picture_url || ''
      });
    }
  }, [profile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile-picture.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload profile picture",
          variant: "destructive",
        });
        return;
      }

      const { data } = supabase.storage
        .from('profile-assets')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        profilePictureUrl: data.publicUrl
      }));
    }
  };

  const handleNext = async () => {
    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      toast({
        title: "Error",
        description: "First name and last name must be at least 2 characters long",
        variant: "destructive",
      });
      return;
    }

    const { error } = await updateProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      profile_picture_url: formData.profilePictureUrl,
      setup_step: 2
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save profile information",
        variant: "destructive",
      });
      return;
    }

    navigate('/profile-setup/2');
  };

  const isValid = formData.firstName.length >= 2 && formData.lastName.length >= 2;

  return (
    <ProfileSetupLayout
      step={1}
      title="Basic Information"
      description="Let's start with your basic information. This helps clients know who you are."
      onNext={handleNext}
      nextDisabled={!isValid}
      showBack={false}
    >
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData.profilePictureUrl ? (
                <img 
                  src={formData.profilePictureUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <Button
              type="button"
              size="sm"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-600">Upload your profile picture</p>
        </div>

        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Enter your first name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter your last name"
              className="mt-1"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500">
          * Required fields. Names must be at least 2 characters long.
        </p>
      </div>
    </ProfileSetupLayout>
  );
};

export default ProfileSetup1;
