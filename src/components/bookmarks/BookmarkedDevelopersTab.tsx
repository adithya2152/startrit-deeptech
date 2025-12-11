
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bookmark, Eye, User } from 'lucide-react';

interface BookmarkedDeveloper {
  id: string;
  developer_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    title: string;
    profile_picture_url: string;
    bio: string;
  } | null;
}

const BookmarkedDevelopersTab = () => {
  const { user } = useAuth();
  const [bookmarkedDevelopers, setBookmarkedDevelopers] = useState<BookmarkedDeveloper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarkedDevelopers();
    }
  }, [user]);

  const fetchBookmarkedDevelopers = async () => {
    try {
      // First get bookmarks for developers
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('id, developer_id')
        .eq('user_id', user?.id)
        .eq('bookmark_type', 'developer')
        .not('developer_id', 'is', null);

      if (bookmarkError) throw bookmarkError;

      if (!bookmarkData || bookmarkData.length === 0) {
        setBookmarkedDevelopers([]);
        return;
      }

      // Get developer IDs and fetch their profiles
      const developerIds = bookmarkData.map(b => b.developer_id);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, title, profile_picture_url, bio')
        .in('user_id', developerIds);

      if (profileError) throw profileError;

      // Combine bookmark data with profile data
      const combinedData = bookmarkData.map(bookmark => {
        const profile = profileData?.find(p => p.user_id === bookmark.developer_id);
        return {
          id: bookmark.id,
          developer_id: bookmark.developer_id,
          profiles: profile ? {
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            title: profile.title || '',
            profile_picture_url: profile.profile_picture_url || '',
            bio: profile.bio || ''
          } : null
        };
      });

      setBookmarkedDevelopers(combinedData);
    } catch (error) {
      console.error('Error fetching bookmarked developers:', error);
      setBookmarkedDevelopers([]);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
      
      setBookmarkedDevelopers(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookmarkedDevelopers.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarked developers</h3>
        <p className="text-gray-600">Start bookmarking developers you want to work with.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarkedDevelopers.map((bookmark) => (
        <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Avatar className="h-16 w-16 mx-auto mb-2">
              <AvatarImage src={bookmark.profiles?.profile_picture_url} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">
              {bookmark.profiles?.first_name} {bookmark.profiles?.last_name}
            </h3>
            <p className="text-sm text-gray-600">{bookmark.profiles?.title}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {bookmark.profiles?.bio}
            </p>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex items-center gap-1 flex-1">
                <Eye className="h-4 w-4" />
                View Profile
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => removeBookmark(bookmark.id)}
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookmarkedDevelopersTab;
