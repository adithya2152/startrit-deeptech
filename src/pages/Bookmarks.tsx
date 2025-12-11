
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookmarkedProjectsTab from '@/components/bookmarks/BookmarkedProjectsTab';
import BookmarkedDevelopersTab from '@/components/bookmarks/BookmarkedDevelopersTab';
import BookmarkedPostsTab from '@/components/bookmarks/BookmarkedPostsTab';
import BookmarkedBlogsTab from '@/components/bookmarks/BookmarkedBlogsTab';
import BookmarkedTasksTab from '@/components/bookmarks/BookmarkedTasksTab';

const Bookmarks = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

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
          <p className="text-gray-600">Loading bookmarks...</p>
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
        navigate('/feedback');
        break;
      case 'updates':
        navigate('/project-updates');
        break;
      case 'bookmarks':
        // Already on bookmarks page
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar 
        activeSection="bookmarks"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🔖 Bookmarks</h1>
            <p className="text-gray-600">
              Access your saved projects, developers, posts, blogs, and tasks
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="projects">📁 Projects</TabsTrigger>
              <TabsTrigger value="developers">👤 Developers</TabsTrigger>
              <TabsTrigger value="posts">📝 Posts</TabsTrigger>
              <TabsTrigger value="blogs">📚 Blogs</TabsTrigger>
              <TabsTrigger value="tasks">✅ Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6">
              <BookmarkedProjectsTab />
            </TabsContent>

            <TabsContent value="developers" className="mt-6">
              <BookmarkedDevelopersTab />
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <BookmarkedPostsTab />
            </TabsContent>

            <TabsContent value="blogs" className="mt-6">
              <BookmarkedBlogsTab />
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <BookmarkedTasksTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Bookmarks;
