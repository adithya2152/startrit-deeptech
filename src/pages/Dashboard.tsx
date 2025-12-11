
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardHome from '@/components/dashboard/DashboardHome';
import DashboardTasklist from '@/components/dashboard/DashboardTasklist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurrentProjectsTab from '@/components/projects/CurrentProjectsTab';
import PastProjectsTab from '@/components/projects/PastProjectsTab';
import PostedProjectsTab from '@/components/projects/PostedProjectsTab';
import ProposalsTab from '@/components/projects/ProposalsTab';
import ConversationList from '@/components/inbox/ConversationList';
import MessageView from '@/components/inbox/MessageView';
import StartConversationButton from '@/components/inbox/StartConversationButton';
import WriteFeedbackTab from '@/components/feedback/WriteFeedbackTab';
import GivenFeedbackTab from '@/components/feedback/GivenFeedbackTab';
import ReceivedFeedbackTab from '@/components/feedback/ReceivedFeedbackTab';
import ProjectUpdatesContent from '@/components/updates/ProjectUpdatesContent';
import BookmarkedPostsTab from '@/components/bookmarks/BookmarkedPostsTab';
import BookmarkedBlogsTab from '@/components/bookmarks/BookmarkedBlogsTab';
import BookmarkedProjectsTab from '@/components/bookmarks/BookmarkedProjectsTab';
import BookmarkedDevelopersTab from '@/components/bookmarks/BookmarkedDevelopersTab';
import BookmarkedTasksTab from '@/components/bookmarks/BookmarkedTasksTab';
import BrowseDoubts from '@/components/doubts/BrowseDoubts';
import YourDoubts from '@/components/doubts/YourDoubts';
import PostDoubtForm from '@/components/doubts/PostDoubtForm';
import { useConversations } from '@/hooks/useConversations';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { createOrGetConversation } = useConversations();

  // Handle redirects in useEffect to prevent render-time navigation
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

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user || (profile && !profile.is_completed)) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome profile={profile} />;
      case 'tasklist':
        return <DashboardTasklist />;
      case 'projects':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Projects</h1>
            <Tabs defaultValue="proposals" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="proposals">Proposals</TabsTrigger>
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="posted">Posted</TabsTrigger>
              </TabsList>
              <TabsContent value="proposals" className="mt-6">
                <ProposalsTab />
              </TabsContent>
              <TabsContent value="current" className="mt-6">
                <CurrentProjectsTab userType="developer" />
              </TabsContent>
              <TabsContent value="past" className="mt-6">
                <PastProjectsTab userType="developer" />
              </TabsContent>
              <TabsContent value="posted" className="mt-6">
                <PostedProjectsTab />
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'inbox':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
              <StartConversationButton targetUserId="" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ConversationList 
                  conversations={[]}
                  selectedConversation={selectedConversationId}
                  onSelectConversation={setSelectedConversationId}
                  currentUserId={user?.id || ''}
                />
              </div>
              <div className="lg:col-span-2">
                <MessageView 
                  conversationId={selectedConversationId}
                  currentUserId={user?.id || ''}
                />
              </div>
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Feedback</h1>
            <Tabs defaultValue="write" className="w-full">
              <TabsList>
                <TabsTrigger value="write">Write Feedback</TabsTrigger>
                <TabsTrigger value="given">Given</TabsTrigger>
                <TabsTrigger value="received">Received</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-6">
                <WriteFeedbackTab />
              </TabsContent>
              <TabsContent value="given" className="mt-6">
                <GivenFeedbackTab />
              </TabsContent>
              <TabsContent value="received" className="mt-6">
                <ReceivedFeedbackTab />
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'updates':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Updates</h1>
            <ProjectUpdatesContent />
          </div>
        );
      case 'bookmarks':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Bookmarks</h1>
            <Tabs defaultValue="posts" className="w-full">
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="developers">Developers</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-6">
                <BookmarkedPostsTab />
              </TabsContent>
              <TabsContent value="blogs" className="mt-6">
                <BookmarkedBlogsTab />
              </TabsContent>
              <TabsContent value="projects" className="mt-6">
                <BookmarkedProjectsTab />
              </TabsContent>
              <TabsContent value="developers" className="mt-6">
                <BookmarkedDevelopersTab />
              </TabsContent>
              <TabsContent value="tasks" className="mt-6">
                <BookmarkedTasksTab />
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'doubts':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Ask Doubt</h1>
            <Tabs defaultValue="browse" className="w-full">
              <TabsList>
                <TabsTrigger value="browse">Browse Doubts</TabsTrigger>
                <TabsTrigger value="your">Your Doubts</TabsTrigger>
                <TabsTrigger value="post">Post Doubt</TabsTrigger>
              </TabsList>
              <TabsContent value="browse" className="mt-6">
                <BrowseDoubts />
              </TabsContent>
              <TabsContent value="your" className="mt-6">
                <YourDoubts />
              </TabsContent>
              <TabsContent value="post" className="mt-6">
                <PostDoubtForm onSuccess={() => setActiveSection('doubts')} />
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'credits':
        return <div className="p-6"><h2 className="text-2xl font-bold">Free Credit</h2><p>Manage your credits here</p></div>;
      case 'pricing':
        return <div className="p-6"><h2 className="text-2xl font-bold">Pricing Tool</h2><p>Estimate project pricing here</p></div>;
      default:
        return <DashboardHome profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header - Full Width */}
      <DashboardHeader 
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
