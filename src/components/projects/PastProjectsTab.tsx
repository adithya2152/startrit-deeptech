
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EyeIcon, EditIcon, SearchIcon, StarIcon } from 'lucide-react';

interface PastProject {
  id: string;
  project_title: string;
  client_name?: string;
  developer_name?: string;
  completion_date: string;
  rating_given?: number;
  rating_received?: number;
  feedback_status: 'pending' | 'completed';
}

interface PastProjectsTabProps {
  userType: 'developer' | 'client';
}

const PastProjectsTab = ({ userType }: PastProjectsTabProps) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<PastProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchPastProjects();
    }
  }, [user, userType]);

  const fetchPastProjects = async () => {
    try {
      // Mock data - in real implementation, this would query based on userType
      const mockProjects: PastProject[] = userType === 'developer' 
        ? [
            {
              id: '1',
              project_title: 'Corporate Website Redesign',
              client_name: 'Business Corp',
              completion_date: '2024-01-05',
              rating_received: 5,
              feedback_status: 'completed'
            },
            {
              id: '2',
              project_title: 'E-learning Platform',
              client_name: 'EduTech Solutions',
              completion_date: '2023-12-20',
              rating_received: 4,
              feedback_status: 'completed'
            },
            {
              id: '3',
              project_title: 'CRM System Integration',
              client_name: 'Sales Inc',
              completion_date: '2023-12-10',
              feedback_status: 'pending'
            }
          ]
        : [
            {
              id: '1',
              project_title: 'Mobile App Development',
              developer_name: 'Sarah Wilson',
              completion_date: '2024-01-08',
              rating_given: 5,
              feedback_status: 'completed'
            },
            {
              id: '2',
              project_title: 'Database Optimization',
              developer_name: 'Mike Chen',
              completion_date: '2023-12-25',
              rating_given: 4,
              feedback_status: 'completed'
            },
            {
              id: '3',
              project_title: 'API Development',
              developer_name: 'Lisa Rodriguez',
              completion_date: '2023-12-15',
              feedback_status: 'pending'
            }
          ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching past projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const searchText = searchTerm.toLowerCase();
    return project.project_title.toLowerCase().includes(searchText) ||
           (project.client_name && project.client_name.toLowerCase().includes(searchText)) ||
           (project.developer_name && project.developer_name.toLowerCase().includes(searchText));
  });

  const handleViewHistory = (projectId: string) => {
    console.log('View history for project:', projectId);
    // Navigate to project history page
  };

  const handleLeaveFeedback = (projectId: string) => {
    console.log('Leave feedback for project:', projectId);
    // Open feedback modal or navigate to feedback page
  };

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-gray-400">Pending</span>;
    
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
          🟦 Past Projects
          <Badge variant="secondary">{filteredProjects.length}</Badge>
        </CardTitle>
        
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={`Search projects or ${userType === 'developer' ? 'clients' : 'developers'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No completed projects found</p>
            <p className="text-sm text-gray-400 mt-2">
              Your completed projects will appear here
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>{userType === 'developer' ? 'Client Name' : 'Developer Name'}</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Rating {userType === 'developer' ? 'Received' : 'Given'}</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto text-left font-medium">
                      {project.project_title}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {userType === 'developer' ? project.client_name : project.developer_name}
                  </TableCell>
                  <TableCell>{new Date(project.completion_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {renderStars(userType === 'developer' ? project.rating_received : project.rating_given)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewHistory(project.id)}
                        title="View History"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      {project.feedback_status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLeaveFeedback(project.id)}
                          title="Leave Feedback"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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

export default PastProjectsTab;
