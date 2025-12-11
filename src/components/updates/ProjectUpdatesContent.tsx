
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, SearchIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react';
import AddUpdateDialog from './AddUpdateDialog';
import UpdateCard from './UpdateCard';

interface ProjectUpdate {
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
}

const ProjectUpdatesContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchUpdates();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, status')
        .eq('developer_id', user?.id)
        .eq('status', 'in_progress')
        .order('title');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('project_updates')
        .select(`
          *,
          projects!inner(
            title,
            client_id,
            developer_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user profiles for names
      const userIds = data?.map(update => 
        update.projects.client_id === user?.id ? update.projects.developer_id : update.projects.client_id
      ).filter(Boolean) || [];

      let userProfiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', userIds);
        userProfiles = profiles || [];
      }

      // Get comments count for each update
      const updateIds = data?.map(update => update.id) || [];
      let commentsCounts: any[] = [];
      if (updateIds.length > 0) {
        const { data: comments } = await supabase
          .from('update_comments')
          .select('update_id, id')
          .in('update_id', updateIds);
        
        commentsCounts = updateIds.map(updateId => ({
          update_id: updateId,
          count: comments?.filter(c => c.update_id === updateId).length || 0
        }));
      }

      const formattedUpdates = data?.map(update => {
        const otherPartyId = update.projects.client_id === user?.id ? update.projects.developer_id : update.projects.client_id;
        const otherParty = userProfiles.find(p => p.user_id === otherPartyId);
        const otherPartyName = otherParty ? `${otherParty.first_name} ${otherParty.last_name}` : 'Unknown User';
        const commentsCount = commentsCounts.find(c => c.update_id === update.id)?.count || 0;

        return {
          id: update.id,
          project_id: update.project_id,
          title: update.title,
          description: update.description,
          attachments: update.attachments || [],
          created_at: update.created_at,
          project_title: update.projects.title,
          client_name: update.projects.client_id === user?.id ? 'You' : otherPartyName,
          developer_name: update.projects.developer_id === user?.id ? 'You' : otherPartyName,
          comments_count: commentsCount,
        };
      }) || [];

      setUpdates(formattedUpdates);
    } catch (error) {
      console.error('Error fetching updates:', error);
      toast({
        title: "Error",
        description: "Failed to load project updates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = searchTerm === '' || 
      update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.project_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProject = selectedProject === 'all' || update.project_id === selectedProject;
    
    return matchesSearch && matchesProject;
  });

  const handleUpdateAdded = () => {
    fetchUpdates();
    setShowAddDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Project Updates</h1>
        <p className="text-gray-600">Track and manage progress updates for your projects</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Updates
              <Badge variant="secondary">{filteredUpdates.length}</Badge>
            </div>
            {projects.length > 0 && (
              <Button onClick={() => setShowAddDialog(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Update
              </Button>
            )}
          </CardTitle>
          
          <div className="flex gap-4 mt-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search updates or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredUpdates.length === 0 ? (
            <div className="text-center py-8">
              <FileTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No project updates found</p>
              <p className="text-sm text-gray-400">
                {projects.length === 0 
                  ? 'You need active projects to create updates'
                  : 'Start by adding your first project update'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <UpdateCard
                  key={update.id}
                  update={update}
                  onUpdateChange={fetchUpdates}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddUpdateDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        projects={projects}
        onUpdateAdded={handleUpdateAdded}
      />
    </div>
  );
};

export default ProjectUpdatesContent;
