
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GivenFeedbackTab from '@/components/feedback/GivenFeedbackTab';
import ReceivedFeedbackTab from '@/components/feedback/ReceivedFeedbackTab';
import WriteFeedbackTab from '@/components/feedback/WriteFeedbackTab';

const Feedback = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (profile && !profile.is_completed) {
        navigate(`/profile-setup/${profile.setup_step || 1}`);
        return;
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (!user || (profile && !profile.is_completed)) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSectionChange = (section: string) => {
    switch (section) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'tasklist':
        navigate('/dashboard'); // Navigate to dashboard and let it handle tasklist
        break;
      case 'projects':
        navigate('/my-projects');
        break;
      case 'feedback':
        // Already on feedback page
        break;
      case 'updates':
        navigate('/project-updates');
        break;
      case 'bookmarks':
        navigate('/bookmarks');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar 
        activeSection="feedback"
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          user={user}
          profile={profile}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 Feedback</h1>
            <p className="text-gray-600">
              Manage feedback given and received for your projects
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="given">Given</TabsTrigger>
              <TabsTrigger value="write">Write Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="mt-6">
              <ReceivedFeedbackTab />
            </TabsContent>

            <TabsContent value="given" className="mt-6">
              <GivenFeedbackTab />
            </TabsContent>

            <TabsContent value="write" className="mt-6">
              <WriteFeedbackTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Feedback;
