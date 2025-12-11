
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, FileText, Mail, TrendingUp, User, Award, Briefcase, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/hooks/useProfile';

interface DashboardHomeProps {
  profile: Profile | null;
}

const DashboardHome = ({ profile }: DashboardHomeProps) => {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getProfileCompletionScore = () => {
    let score = 0;
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.profile_picture_url,
      profile.title,
      profile.bio,
      profile.date_of_birth,
      profile.gender
    ];
    
    fields.forEach(field => {
      if (field) score += 1;
    });
    
    return Math.round((score / fields.length) * 100);
  };

  const completionScore = getProfileCompletionScore();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.profile_picture_url || ''} />
            <AvatarFallback className="text-blue-600 bg-white">
              {getInitials(profile.first_name, profile.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile.first_name}!
            </h1>
            <p className="text-blue-100">
              {profile.title || 'Developer'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Completion */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{completionScore}%</div>
              <Progress value={completionScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completionScore === 100 ? 'Profile complete!' : 'Complete your profile to attract more clients'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              No projects completed yet
            </p>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No active projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Setup Completion Panel */}
      {completionScore < 100 && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!profile.profile_picture_url && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Add Profile Picture</span>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              )}
              
              {!profile.bio && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Add Bio Description</span>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              )}
              
              {profile.profile_picture_url && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Profile Picture</span>
                  </div>
                  <Badge variant="default">Complete</Badge>
                </div>
              )}
              
              {profile.bio && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Bio Description</span>
                  </div>
                  <Badge variant="default">Complete</Badge>
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => navigate('/profile')} 
              className="w-full"
            >
              Complete Profile Setup
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/profile')}
            >
              <Edit className="h-5 w-5" />
              <span className="text-sm">Update Profile</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/profile')}
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm">Update Portfolio</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              
            >
              <Mail className="h-5 w-5" />
              <span className="text-sm">Client Messages</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              
            >
              <Award className="h-5 w-5" />
              <span className="text-sm">View Proposals</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
            <p className="text-sm">Start by completing your profile or browsing projects</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
