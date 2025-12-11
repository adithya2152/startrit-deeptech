
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Eye, Calendar, User } from 'lucide-react';

interface BookmarkedBlog {
  id: string;
  blog_id: string;
  blogs: {
    title: string;
    content: string;
    created_at: string;
    author_name: string;
    excerpt: string;
  };
}

const BookmarkedBlogsTab = () => {
  const { user } = useAuth();
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<BookmarkedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarkedBlogs();
    }
  }, [user]);

  const fetchBookmarkedBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          blog_id,
          blogs (
            title,
            content,
            created_at,
            author_name,
            excerpt
          )
        `)
        .eq('user_id', user?.id)
        .eq('bookmark_type', 'blog');

      if (error) throw error;
      setBookmarkedBlogs(data || []);
    } catch (error) {
      console.error('Error fetching bookmarked blogs:', error);
      setBookmarkedBlogs([]);
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
      
      setBookmarkedBlogs(prev => prev.filter(b => b.id !== bookmarkId));
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

  if (bookmarkedBlogs.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarked blogs</h3>
        <p className="text-gray-600">Long-form content you bookmark will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarkedBlogs.map((bookmark) => (
        <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{bookmark.blogs.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {bookmark.blogs.excerpt || bookmark.blogs.content}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{bookmark.blogs.author_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(bookmark.blogs.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Read Full Blog
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

export default BookmarkedBlogsTab;
