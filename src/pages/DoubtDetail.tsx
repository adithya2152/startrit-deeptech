
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, MessageCircle, Clock, User, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Doubt {
  id: string;
  title: string;
  description: string;
  domain: string;
  tags: string[];
  created_at: string;
  user_id: string;
}

interface Answer {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  user_id: string;
  user_vote?: 'upvote' | 'downvote' | null;
}

const DoubtDetail = () => {
  const { doubtId } = useParams<{ doubtId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doubt, setDoubt] = useState<Doubt | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    if (doubtId) {
      fetchDoubtAndAnswers();
    }
  }, [doubtId]);

  const fetchDoubtAndAnswers = async () => {
    if (!doubtId) return;

    setLoading(true);
    try {
      // Fetch doubt
      const { data: doubtData, error: doubtError } = await supabase
        .from('doubts')
        .select('*')
        .eq('id', doubtId)
        .single();

      if (doubtError) throw doubtError;
      setDoubt(doubtData);

      // Fetch answers with user votes
      const { data: answersData, error: answersError } = await supabase
        .from('doubt_answers')
        .select(`
          *,
          answer_votes!left(vote_type, user_id)
        `)
        .eq('doubt_id', doubtId)
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;

      const answersWithVotes: Answer[] = answersData?.map(answer => {
        const userVote = user 
          ? answer.answer_votes?.find((vote: any) => vote.user_id === user.id)?.vote_type || null
          : null;
        
        return {
          id: answer.id,
          content: answer.content,
          upvotes: answer.upvotes || 0,
          downvotes: answer.downvotes || 0,
          created_at: answer.created_at,
          user_id: answer.user_id,
          user_vote: userVote as 'upvote' | 'downvote' | null
        };
      }) || [];

      setAnswers(answersWithVotes);
    } catch (error) {
      console.error('Error fetching doubt:', error);
      toast({
        title: 'Error',
        description: 'Failed to load doubt details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!user || !doubtId || !newAnswer.trim()) return;

    setSubmittingAnswer(true);
    try {
      const { error } = await supabase
        .from('doubt_answers')
        .insert({
          doubt_id: doubtId,
          user_id: user.id,
          content: newAnswer.trim(),
        });

      if (error) throw error;

      setNewAnswer('');
      fetchDoubtAndAnswers();
      toast({
        title: 'Success',
        description: 'Your answer has been posted.',
      });
    } catch (error) {
      console.error('Error posting answer:', error);
      toast({
        title: 'Error',
        description: 'Failed to post answer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleVote = async (answerId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to vote on answers.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const answer = answers.find(a => a.id === answerId);
      if (!answer) return;

      if (answer.user_vote === voteType) {
        // Remove vote
        await supabase
          .from('answer_votes')
          .delete()
          .eq('answer_id', answerId)
          .eq('user_id', user.id);
      } else {
        // Add or update vote
        await supabase
          .from('answer_votes')
          .upsert({
            answer_id: answerId,
            user_id: user.id,
            vote_type: voteType,
          });
      }

      fetchDoubtAndAnswers();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: 'Failed to record vote. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doubt not found</h2>
          <p className="text-gray-600 mb-4">The doubt you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/ask-doubt')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Doubts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/ask-doubt')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Doubts
          </Button>

          {/* Doubt Details */}
          <Card className="mb-8">
            <CardHeader>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{doubt.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{doubt.domain}</Badge>
                {doubt.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Developer</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(doubt.created_at))} ago</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{answers.length} answers</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{doubt.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Answers Section */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {answers.map((answer) => (
                <div key={answer.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(answer.id, 'upvote')}
                        className={answer.user_vote === 'upvote' ? 'text-green-600' : ''}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {answer.upvotes - answer.downvotes}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(answer.id, 'downvote')}
                        className={answer.user_vote === 'downvote' ? 'text-red-600' : ''}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex-1">
                      <div className="prose max-w-none mb-3">
                        <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Developer</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(answer.created_at))} ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Answer Form */}
          {user && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Your Answer</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write your answer here... Be detailed and helpful!"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!newAnswer.trim() || submittingAnswer}
                  >
                    {submittingAnswer ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Post Answer
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!user && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600 mb-4">Please log in to post an answer.</p>
                <Button onClick={() => navigate('/auth')}>
                  Log In
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtDetail;
