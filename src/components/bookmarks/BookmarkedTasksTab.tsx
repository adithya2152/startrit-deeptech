
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Eye, Calendar, CheckSquare, AlertCircle } from 'lucide-react';

interface BookmarkedTask {
  id: string;
  task_id: string;
  tasks: {
    title: string;
    description: string;
    status: string;
    due_date: string;
    created_at: string;
  };
}

const BookmarkedTasksTab = () => {
  const { user } = useAuth();
  const [bookmarkedTasks, setBookmarkedTasks] = useState<BookmarkedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarkedTasks();
    }
  }, [user]);

  const fetchBookmarkedTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          task_id,
          tasks (
            title,
            description,
            status,
            due_date,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .eq('bookmark_type', 'task');

      if (error) throw error;
      setBookmarkedTasks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarked tasks:', error);
      setBookmarkedTasks([]);
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
      
      setBookmarkedTasks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'in_progress':
        return 'default';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookmarkedTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarked tasks</h3>
        <p className="text-gray-600">Important tasks you bookmark will appear here for quick access.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarkedTasks.map((bookmark) => (
        <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(bookmark.tasks.status)}
                {bookmark.tasks.title}
              </CardTitle>
              <Badge variant={getStatusVariant(bookmark.tasks.status)}>
                {bookmark.tasks.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {bookmark.tasks.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {bookmark.tasks.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              {bookmark.tasks.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(bookmark.tasks.due_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(bookmark.tasks.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                View in Tasklist
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

export default BookmarkedTasksTab;
