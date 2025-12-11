
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SearchIcon, StarIcon } from 'lucide-react';

interface GivenFeedback {
  id: string;
  project_id: string;
  project_title: string;
  receiver_id: string;
  receiver_name: string;
  rating: number;
  message: string;
  is_anonymous: boolean;
  created_at: string;
}

const GivenFeedbackTab = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<GivenFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchGivenFeedback();
    }
  }, [user]);

  const fetchGivenFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          id,
          project_id,
          receiver_id,
          rating,
          message,
          is_anonymous,
          created_at,
          projects!inner(title)
        `)
        .eq('giver_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get receiver profiles
      const receiverIds = data?.map(item => item.receiver_id) || [];
      let receiverProfiles: any[] = [];
      if (receiverIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', receiverIds);
        receiverProfiles = profiles || [];
      }

      const formattedFeedback = data?.map(item => {
        const receiver = receiverProfiles.find(p => p.user_id === item.receiver_id);
        return {
          id: item.id,
          project_id: item.project_id,
          project_title: (item.projects as any)?.title || 'Unknown Project',
          receiver_id: item.receiver_id,
          receiver_name: receiver ? `${receiver.first_name} ${receiver.last_name}` : 'Unknown User',
          rating: item.rating,
          message: item.message,
          is_anonymous: item.is_anonymous,
          created_at: item.created_at,
        };
      }) || [];

      setFeedback(formattedFeedback);
    } catch (error) {
      console.error('Error fetching given feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = feedback.filter(item => {
    const searchText = searchTerm.toLowerCase();
    return item.project_title.toLowerCase().includes(searchText) ||
           item.receiver_name.toLowerCase().includes(searchText) ||
           item.message.toLowerCase().includes(searchText);
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📝 Given Feedback
          <Badge variant="secondary">{filteredFeedback.length}</Badge>
        </CardTitle>
        
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects, recipients, or feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback given yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Complete projects and leave feedback to build your reputation
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Anonymous</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.project_title}
                  </TableCell>
                  <TableCell>
                    {item.receiver_name}
                  </TableCell>
                  <TableCell>
                    {renderStars(item.rating)}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate" title={item.message}>
                      {item.message}
                    </p>
                  </TableCell>
                  <TableCell>
                    {item.is_anonymous ? (
                      <Badge variant="outline">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default GivenFeedbackTab;
