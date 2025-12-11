
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Eye, DollarSign, Calendar } from 'lucide-react';

interface BookmarkedProject {
  id: string;
  project_id: string;
  projects: {
    title: string;
    description: string;
    budget_min: number;
    budget_max: number;
    created_at: string;
    status: string;
  };
}

const BookmarkedProjectsTab = () => {
  const { user } = useAuth();
  const [bookmarkedProjects, setBookmarkedProjects] = useState<BookmarkedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarkedProjects();
    }
  }, [user]);

  const fetchBookmarkedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          project_id,
          projects (
            title,
            description,
            budget_min,
            budget_max,
            created_at,
            status
          )
        `)
        .eq('user_id', user?.id)
        .eq('bookmark_type', 'project');

      if (error) throw error;
      setBookmarkedProjects(data || []);
    } catch (error) {
      console.error('Error fetching bookmarked projects:', error);
      setBookmarkedProjects([]);
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
      
      setBookmarkedProjects(prev => prev.filter(b => b.id !== bookmarkId));
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

  if (bookmarkedProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarked projects</h3>
        <p className="text-gray-600">Start bookmarking projects you're interested in to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarkedProjects.map((bookmark) => (
        <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{bookmark.projects.title}</CardTitle>
              <Badge variant={bookmark.projects.status === 'open' ? 'default' : 'secondary'}>
                {bookmark.projects.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {bookmark.projects.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>
                  ${bookmark.projects.budget_min} - ${bookmark.projects.budget_max}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(bookmark.projects.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => removeBookmark(bookmark.id)}
              >
                Remove Bookmark
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookmarkedProjectsTab;
