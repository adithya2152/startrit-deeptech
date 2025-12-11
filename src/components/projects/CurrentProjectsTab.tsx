
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, CheckSquareIcon, MessageSquareIcon, SearchIcon, CalendarIcon } from 'lucide-react';

interface CurrentProject {
  id: string;
  title: string;
  description: string;
  client_name?: string;
  developer_name?: string;
  deadline?: string;
  budget_min?: number;
  budget_max?: number;
  created_at: string;
}

interface CurrentProjectsTabProps {
  userType: 'developer' | 'client';
}

const CurrentProjectsTab = ({ userType }: CurrentProjectsTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<CurrentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchCurrentProjects();
    }
  }, [user, userType]);

  const fetchCurrentProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'in_progress')
        .eq(userType === 'client' ? 'client_id' : 'developer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user profiles for the other party
      const userIds = data?.map(project => 
        userType === 'client' ? project.developer_id : project.client_id
      ).filter(Boolean) || [];

      let userProfiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', userIds);
        userProfiles = profiles || [];
      }

      const formattedProjects = data?.map(project => {
        const otherPartyId = userType === 'client' ? project.developer_id : project.client_id;
        const otherParty = userProfiles.find(p => p.user_id === otherPartyId);
        const otherPartyName = otherParty ? `${otherParty.first_name} ${otherParty.last_name}` : 'Unknown User';

        return {
          id: project.id,
          title: project.title,
          description: project.description || '',
          client_name: userType === 'client' ? 'You' : otherPartyName,
          developer_name: userType === 'developer' ? 'You' : otherPartyName,
          deadline: project.deadline,
          budget_min: project.budget_min,
          budget_max: project.budget_max,
          created_at: project.created_at,
        };
      }) || [];

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching current projects:', error);
      toast({
        title: "Error",
        description: "Failed to load current projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const searchText = searchTerm.toLowerCase();
    return project.title.toLowerCase().includes(searchText) ||
           (project.client_name && project.client_name.toLowerCase().includes(searchText)) ||
           (project.developer_name && project.developer_name.toLowerCase().includes(searchText));
  });

  const handleAddUpdate = (projectId: string) => {
    console.log('Add update for project:', projectId);
    // TODO: Implement add update functionality
  };

  const handleViewTasklist = (projectId: string) => {
    console.log('View tasklist for project:', projectId);
    // TODO: Navigate to tasklist view
  };

  const handleChat = (projectId: string) => {
    console.log('Open chat for project:', projectId);
    // TODO: Implement chat functionality
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
          🟩 Current Projects
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
            <p className="text-gray-500">No active projects found</p>
            <p className="text-sm text-gray-400 mt-2">
              {userType === 'client' 
                ? 'Post a project to get started'
                : 'Start bidding on projects to begin working'
              }
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>{userType === 'developer' ? 'Client' : 'Developer'}</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <Button variant="link" className="p-0 h-auto text-left font-medium">
                        {project.title}
                      </Button>
                      {project.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {userType === 'developer' ? project.client_name : project.developer_name}
                  </TableCell>
                  <TableCell>
                    {project.budget_min && project.budget_max ? (
                      <span>${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-400">Not specified</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {project.deadline ? (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-400">No deadline</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddUpdate(project.id)}
                        title="Add Update"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTasklist(project.id)}
                        title="View Tasklist"
                      >
                        <CheckSquareIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChat(project.id)}
                        title="Chat"
                      >
                        <MessageSquareIcon className="h-4 w-4" />
                      </Button>
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

export default CurrentProjectsTab;
