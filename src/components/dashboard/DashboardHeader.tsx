import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Settings, User as UserIcon, LogOut } from 'lucide-react';

import BrowseModal from '@/pages/BrowseModal';

interface DashboardHeaderProps {
  user: User | null;
  profile: Profile | null;
  onSignOut: () => void;
}

const DashboardHeader = ({ user, profile, onSignOut }: DashboardHeaderProps) => {
  const [showBrowseModal, setShowBrowseModal] = useState(false);

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email || 'User';
  };

  // Map nav label to route
  const routeMap: Record<string, string> = {
    Browse: '',
    Communities: '/communities',
    Posts: '/posts',      // ✅ this is the route to Posts page
    Blogs: '/blogs',
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">Startrit</h1>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center space-x-8 relative">
          {['Browse', 'Communities', 'Posts', 'Blogs'].map((label) =>
            label === 'Browse' ? (
              <div
                key={label}
                className="relative"
                onMouseEnter={() => setShowBrowseModal(true)}
                onMouseLeave={() => setShowBrowseModal(false)}
              >
                <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                  {label}
                </span>
                {showBrowseModal && (
                  <div className="absolute top-8 left-0 z-50">
                    <BrowseModal />
                  </div>
                )}
              </div>
            ) : (
              <a
                key={label}
                href={routeMap[label]}
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                {label}
              </a>
            )
          )}
        </nav>

        {/* Right: User actions */}
        <div className="flex items-center space-x-4">
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Post a Project
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.profile_picture_url || ''} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {getUserDisplayName()}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <UserIcon className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
