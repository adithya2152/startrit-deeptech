
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileTextIcon, EditIcon, TrashIcon, SearchIcon, EyeIcon } from 'lucide-react';

interface PostedProject {
  id: string;
  project_title: string;
  posted_date: string;
  proposals_count: number;
  selected_developer?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  budget_range: string;
}

const PostedProjectsTab = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<PostedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchPostedProjects();
    }
  }, [user]);

  const fetchPostedProjects = async () => {
    try {
      // Mock data - in real implementation, this would query client's posted projects
      const mockProjects: PostedProject[] = [
        {
          id: '1',
          project_title: 'E-commerce Website Development',
          posted_date: '2024-01-10',
          proposals_count: 12,
          selected_developer: 'John Developer',
          status: 'in_progress',
          budget_range: '$2000-$3000'
        },
        {
          id: '2',
          project_title: 'Mobile App UI/UX Design',
          posted_date: '2024-01-15',
          proposals_count: 8,
          status: 'open',
          budget_range: '$1500-$2500'
        },
        {
          id: '3',
          project_title: 'Database Migration Project',
          posted_date: '2024-01-05',
          proposals_count: 15,
          selected_developer: 'Maria Garcia',
          status: 'completed',
          budget_range: '$3000-$4000'
        },
        {
          id: '4',
          project_title: 'WordPress Plugin Development',
          posted_date: '2024-01-12',
          proposals_count: 3,
          status: 'cancelled',
          budget_range: '$800-$1200'
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching posted projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.selected_developer && project.selected_developer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewProposals = (projectId: string) => {
    console.log('View proposals for project:', projectId);
    // Navigate to proposals view page
  };

  const handleEditProject = (projectId: string) => {
    console.log('Edit project:', projectId);
    // Navigate to edit project page
  };

  const handleDeleteProject = (projectId: string) => {
    console.log('Delete project:', projectId);
    // Show confirmation dialog and delete
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
          🟧 Posted Projects
          <Badge variant="secondary">{filteredProjects.length}</Badge>
        </CardTitle>
        
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects or developers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No posted projects found</p>
            <p className="text-sm text-gray-400 mt-2">
              Projects you've posted will appear here
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Proposals</TableHead>
                <TableHead>Selected Developer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
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
                  <TableCell>{new Date(project.posted_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.proposals_count} proposals</Badge>
                  </TableCell>
                  <TableCell>
                    {project.selected_developer || (
                      <span className="text-gray-400">Not selected</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{project.budget_range}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProposals(project.id)}
                        title="View Proposals"
                      >
                        <FileTextIcon className="h-4 w-4" />
                      </Button>
                      {(project.status === 'open' || project.status === 'in_progress') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project.id)}
                          title="Edit Project"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {project.status === 'open' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          title="Delete Project"
                        >
                          <TrashIcon className="h-4 w-4" />
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

export default PostedProjectsTab;
