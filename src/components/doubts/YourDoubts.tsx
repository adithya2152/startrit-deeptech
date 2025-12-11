
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Doubt {
  id: string;
  title: string;
  description: string;
  domain: string;
  tags: string[];
  created_at: string;
  answer_count?: number;
}

const YourDoubts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserDoubts();
    }
  }, [user]);

  const fetchUserDoubts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doubts')
        .select(`
          *,
          doubt_answers(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const doubtsWithAnswerCount = data?.map(doubt => ({
        ...doubt,
        answer_count: doubt.doubt_answers?.[0]?.count || 0
      })) || [];

      setDoubts(doubtsWithAnswerCount);
    } catch (error) {
      console.error('Error fetching user doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doubtId: string) => {
    if (!confirm('Are you sure you want to delete this doubt? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('doubts')
        .delete()
        .eq('id', doubtId);

      if (error) throw error;

      setDoubts(doubts.filter(doubt => doubt.id !== doubtId));
      toast({
        title: 'Success',
        description: 'Doubt deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting doubt:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete doubt. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDoubtClick = (doubtId: string) => {
    navigate(`/doubt/${doubtId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {doubts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doubts posted yet</h3>
            <p className="text-gray-500 mb-4">
              You haven't posted any doubts yet. Click the "Post a Doubt" tab to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        doubts.map((doubt) => (
          <Card key={doubt.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => handleDoubtClick(doubt.id)}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                    {doubt.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {doubt.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{doubt.domain}</Badge>
                    {doubt.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    {doubt.tags.length > 3 && (
                      <Badge variant="outline">
                        +{doubt.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(doubt.created_at))} ago</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{doubt.answer_count || 0} answers</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doubt.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
};

export default YourDoubts;
