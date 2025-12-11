
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MessageSquareIcon, ExternalLinkIcon, CalendarIcon, UserIcon } from 'lucide-react';

interface UpdateCardProps {
  update: {
    id: string;
    project_id: string;
    title: string;
    description: string;
    attachments: string[];
    created_at: string;
    project_title: string;
    client_name?: string;
    developer_name?: string;
    comments_count: number;
  };
  onUpdateChange: () => void;
}

interface Comment {
  id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  user_name: string;
}

const UpdateCard = ({ update, onUpdateChange }: UpdateCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('update_comments')
        .select('*')
        .eq('update_id', update.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get user names for comments
      const userIds = data?.map(comment => comment.user_id) || [];
      let userProfiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', userIds);
        userProfiles = profiles || [];
      }

      const formattedComments = data?.map(comment => {
        const profile = userProfiles.find(p => p.user_id === comment.user_id);
        return {
          ...comment,
          user_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown User'
        };
      }) || [];

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('update_comments')
        .insert({
          update_id: update.id,
          user_id: user.id,
          comment_text: newComment.trim(),
        });

      if (error) throw error;

      setNewComment('');
      fetchComments();
      onUpdateChange();
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchComments();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{update.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {new Date(update.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                {update.developer_name}
              </div>
            </div>
          </div>
          <Badge variant="outline">{update.project_title}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{update.description}</p>
        
        {update.attachments.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Attachments:</h4>
            <div className="space-y-1">
              {update.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                  {attachment}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleComments}
            className="flex items-center gap-2"
          >
            <MessageSquareIcon className="h-4 w-4" />
            {update.comments_count} Comments
          </Button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{comment.user_name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.comment_text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="flex-1"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || loading}
                size="sm"
              >
                {loading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdateCard;
