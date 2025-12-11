
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTasklist from '@/components/dashboard/DashboardTasklist';

const TaskList = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();

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
          <p className="text-gray-600">Loading tasks...</p>
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
        // Already on tasklist page
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
        navigate('/bookmarks');
        break;
      case 'inbox':
        navigate('/inbox');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar 
        activeSection="tasklist"
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          user={user}
          profile={profile}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 overflow-y-auto">
          <DashboardTasklist />
        </main>
      </div>
    </div>
  );
};

export default TaskList;
