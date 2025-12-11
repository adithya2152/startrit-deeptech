import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Edit, Plus, Download, MapPin, Calendar, Mail, Phone, Shield, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

interface Education {
  id: string;
  degree: string;
  field_of_study: string;
  school: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

interface Credential {
  id: string;
  title: string;
  organization: string;
  issue_date: string;
  expiry_date: string | null;
  does_not_expire: boolean;
  credential_id: string | null;
  credential_link: string | null;
  proof_image_url: string | null;
  description: string | null;
}

interface Skill {
  id: string;
  domain: string;
  subdomain: string | null;
  skill_names: string[];
}

interface SocialLinks {
  id: string;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  other_links: string[] | null;
}

interface Language {
  id: string;
  language_name: string;
  proficiency: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (profile) {
      fetchProfileData();
    }
  }, [user, profile, profileLoading, navigate]);

  const fetchProfileData = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      
      // Fetch all profile-related data
      const [
        experienceRes,
        educationRes,
        credentialsRes,
        skillsRes,
        socialLinksRes,
        languagesRes
      ] = await Promise.all([
        supabase.from('profile_experience').select('*').eq('profile_id', profile.id).order('start_date', { ascending: false }),
        supabase.from('profile_education').select('*').eq('profile_id', profile.id).order('start_date', { ascending: false }),
        supabase.from('profile_credentials').select('*').eq('profile_id', profile.id).order('issue_date', { ascending: false }),
        supabase.from('profile_skills').select('*').eq('profile_id', profile.id),
        supabase.from('profile_social_links').select('*').eq('profile_id', profile.id).single(),
        supabase.from('profile_languages').select('*').eq('profile_id', profile.id)
      ]);

      if (experienceRes.data) setExperiences(experienceRes.data);
      if (educationRes.data) setEducation(educationRes.data);
      if (credentialsRes.data) setCredentials(credentialsRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (socialLinksRes.data) setSocialLinks(socialLinksRes.data);
      if (languagesRes.data) setLanguages(languagesRes.data);
      
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* About Me Section */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.profile_picture_url || ''} />
                      <AvatarFallback className="text-xl">
                        {getInitials(profile.first_name, profile.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profile.first_name} {profile.last_name}
                      </h1>
                      <p className="text-xl text-gray-600 mt-1">{profile.title}</p>
                      <div className="flex items-center mt-2 text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Joined {formatDate(profile.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => navigate('/profile/edit')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                {profile.bio && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Languages */}
            {languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {languages.map((lang) => (
                      <Badge key={lang.id} variant="secondary" className="px-3 py-1">
                        {lang.language_name} - {lang.proficiency}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
           {skills.length > 0 && (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Skills & Expertise</CardTitle>
       <Button
  variant="outline"
  size="sm"
  onClick={() => navigate('/add-skill')}
>
  <Plus className="h-4 w-4 mr-2" />
  Add Skills
</Button>

      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {skills.map((skillGroup) => (
        <div key={skillGroup.id}>
          <h4 className="font-medium text-gray-900 mb-2">
            {skillGroup.domain}
            {skillGroup.subdomain && ` - ${skillGroup.subdomain}`}
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillGroup.skill_names.map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
)}


            {/* Experience */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Experience</CardTitle>
                <Button onClick={() => navigate('/add-experience')} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent>
                {experiences.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No experience added yet</p>
                ) : (
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{exp.title}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : 'N/A'}
                            </p>
                            {exp.description && (
                              <p className="text-gray-700 mt-2">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/add-education')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent>
                {education.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No education added yet</p>
                ) : (
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                        <h4 className="font-semibold text-lg">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.field_of_study}</p>
                        <p className="text-gray-600">{edu.school}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : edu.end_date ? formatDate(edu.end_date) : 'N/A'}
                        </p>
                        {edu.description && (
                          <p className="text-gray-700 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credentials */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Credentials & Certifications</CardTitle>
                <Button variant="outline" size="sm"  onClick={() => navigate('/add-credential')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credential
                </Button>
              </CardHeader>
              <CardContent>
                {credentials.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No credentials added yet</p>
                ) : (
                  <div className="space-y-6">
                    {credentials.map((cred) => (
                      <div key={cred.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{cred.title}</h4>
                            <p className="text-gray-600">{cred.organization}</p>
                            <p className="text-sm text-gray-500">
                              Issued: {formatDate(cred.issue_date)}
                              {!cred.does_not_expire && cred.expiry_date && (
                                <span> | Expires: {formatDate(cred.expiry_date)}</span>
                              )}
                            </p>
                            {cred.credential_id && (
                              <p className="text-sm text-gray-500">ID: {cred.credential_id}</p>
                            )}
                            {cred.description && (
                              <p className="text-gray-700 mt-2">{cred.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {cred.credential_link && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={cred.credential_link} target="_blank" rel="noopener noreferrer">
                                  View
                                </a>
                              </Button>
                            )}
                            {cred.proof_image_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={cred.proof_image_url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            {socialLinks && (
              <Card>
                <CardHeader>
                  <CardTitle>Connect With Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {socialLinks.website && (
                      <Button variant="outline" asChild>
                        <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                          Website
                        </a>
                      </Button>
                    )}
                    {socialLinks.linkedin && (
                      <Button variant="outline" asChild>
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {socialLinks.github && (
                      <Button variant="outline" asChild>
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                          GitHub
                        </a>
                      </Button>
                    )}
                    {socialLinks.twitter && (
                      <Button variant="outline" asChild>
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.date_of_birth && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Born {formatDate(profile.date_of_birth)}</span>
                  </div>
                )}
                {profile.gender && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{profile.gender}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Email</span>
                  </div>
                  <Badge variant={user?.email_confirmed_at ? "default" : "secondary"}>
                    {user?.email_confirmed_at ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <Badge variant="secondary">Not Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Identity</span>
                  </div>
                  <Badge variant="secondary">Not Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Payment</span>
                  </div>
                  <Badge variant="secondary">Not Verified</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
