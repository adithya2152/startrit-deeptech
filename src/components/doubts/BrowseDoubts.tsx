
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Search, MessageCircle, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Doubt {
  id: string;
  title: string;
  description: string;
  domain: string;
  tags: string[];
  created_at: string;
  user_id: string;
  answer_count?: number;
}

const BrowseDoubts = () => {
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const domains = [
    'AI/Machine Learning',
    'Quantum Computing',
    'Embedded Systems',
    'Robotics',
    'Compilers',
    'Security/Cryptography',
    'Distributed Systems',
    'Computer Vision',
    'Natural Language Processing',
    'Hardware Design',
    'Performance Optimization',
    'Other'
  ];

  useEffect(() => {
    fetchDoubts();
  }, [selectedDomain, sortBy]);

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('doubts')
        .select(`
          *,
          doubt_answers(count)
        `);

      if (selectedDomain !== 'all') {
        query = query.eq('domain', selectedDomain);
      }

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;

      const doubtsWithAnswerCount = data?.map(doubt => ({
        ...doubt,
        answer_count: doubt.doubt_answers?.[0]?.count || 0
      })) || [];

      setDoubts(doubtsWithAnswerCount);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoubts = doubts.filter(doubt =>
    doubt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doubt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doubt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search doubts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {domains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Doubts List */}
      <div className="space-y-4">
        {filteredDoubts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doubts found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedDomain !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to post a doubt!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDoubts.map((doubt) => (
            <Card key={doubt.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader onClick={() => handleDoubtClick(doubt.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
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
                        <User className="h-4 w-4" />
                        <span>Developer</span>
                      </div>
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
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseDoubts;
