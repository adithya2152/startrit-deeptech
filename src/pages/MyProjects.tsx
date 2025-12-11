
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProposalsTab from '@/components/projects/ProposalsTab';
import CurrentProjectsTab from '@/components/projects/CurrentProjectsTab';
import PastProjectsTab from '@/components/projects/PastProjectsTab';
import PostedProjectsTab from '@/components/projects/PostedProjectsTab';

const MyProjects = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('proposals');

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

  // Set initial tab based on user type
  useEffect(() => {
    if (profile && activeTab === 'proposals') {
      setActiveTab('proposals');
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
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
      case 'projects':
        // Already on projects page
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      case 'updates':
        navigate('/project-updates');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  // TODO: Implement proper user type detection from profile
  // For now, defaulting to developer
  const userType = 'developer';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar 
        activeSection="projects"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📁 My Projects</h1>
            <p className="text-gray-600">
              {userType === 'developer' 
                ? 'Manage your proposals, current work, and project history'
                : 'Manage your posted projects and track developer progress'
              }
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {userType === 'developer' ? (
                <>
                  <TabsTrigger value="proposals">Proposals</TabsTrigger>
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="posted" className="opacity-50 cursor-not-allowed" disabled>
                    Posted
                  </TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="proposals" className="opacity-50 cursor-not-allowed" disabled>
                    Proposals
                  </TabsTrigger>
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="posted">Posted</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="proposals" className="mt-6">
              <ProposalsTab />
            </TabsContent>

            <TabsContent value="current" className="mt-6">
              <CurrentProjectsTab userType={userType} />
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              <PastProjectsTab userType={userType} />
            </TabsContent>

            <TabsContent value="posted" className="mt-6">
              <PostedProjectsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MyProjects;
