
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { StarIcon } from 'lucide-react';

interface CompletedProject {
  id: string;
  title: string;
  client_id?: string;
  developer_id?: string;
  client_name?: string;
  developer_name?: string;
}

const WriteFeedbackTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<CompletedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    project_id: '',
    rating: 0,
    message: '',
    is_anonymous: false,
  });

  useEffect(() => {
    if (user) {
      fetchCompletedProjects();
    }
  }, [user]);

  const fetchCompletedProjects = async () => {
    setLoading(true);
    try {
      // Get completed projects where user hasn't given feedback yet
      const { data: completedProjects, error } = await supabase
        .from('projects')
        .select('id, title, client_id, developer_id')
        .eq('status', 'completed')
        .or(`client_id.eq.${user?.id},developer_id.eq.${user?.id}`);

      if (error) throw error;

      // Get existing feedback to filter out projects already reviewed
      const { data: existingFeedback } = await supabase
        .from('feedback')
        .select('project_id')
        .eq('giver_id', user?.id);

      const reviewedProjectIds = existingFeedback?.map(f => f.project_id) || [];
      const unreviewedProjects = completedProjects?.filter(
        p => !reviewedProjectIds.includes(p.id)
      ) || [];

      // Get profile names for clients/developers
      const userIds = unreviewedProjects.flatMap(p => [p.client_id, p.developer_id].filter(Boolean));
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);

      const formattedProjects = unreviewedProjects.map(project => {
        const isUserClient = project.client_id === user?.id;
        const recipientId = isUserClient ? project.developer_id : project.client_id;
        const recipient = profiles?.find(p => p.user_id === recipientId);
        
        return {
          id: project.id,
          title: project.title,
          client_id: project.client_id,
          developer_id: project.developer_id,
          client_name: isUserClient ? 'You' : 
            (profiles?.find(p => p.user_id === project.client_id)?.first_name || 'Unknown'),
          developer_name: !isUserClient ? 'You' : 
            (profiles?.find(p => p.user_id === project.developer_id)?.first_name || 'Unknown'),
        };
      });

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching completed projects:', error);
      toast({
        title: "Error",
        description: "Failed to load completed projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_id || !formData.rating || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const selectedProject = projects.find(p => p.id === formData.project_id);
      if (!selectedProject) throw new Error('Project not found');

      // Determine the receiver (the other party in the project)
      const isUserClient = selectedProject.client_id === user?.id;
      const receiverId = isUserClient ? selectedProject.developer_id : selectedProject.client_id;

      const { error } = await supabase
        .from('feedback')
        .insert({
          project_id: formData.project_id,
          giver_id: user?.id,
          receiver_id: receiverId,
          rating: formData.rating,
          message: formData.message.trim(),
          is_anonymous: formData.is_anonymous,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });

      // Reset form and refresh projects
      setFormData({
        project_id: '',
        rating: 0,
        message: '',
        is_anonymous: false,
      });
      fetchCompletedProjects();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
            className="transition-colors"
          >
            <StarIcon
              className={`h-6 w-6 ${
                star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
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
        <CardTitle>✍️ Write Feedback</CardTitle>
        <p className="text-sm text-gray-600">
          Leave feedback for completed projects to help build trust in the community
        </p>
      </CardHeader>

      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No completed projects available for feedback</p>
            <p className="text-sm text-gray-400 mt-2">
              Complete projects to start giving feedback
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project">Project *</Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, project_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a completed project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-500">
                          Client: {project.client_name} | Developer: {project.developer_name}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center gap-2">
                {renderStarRating()}
                {formData.rating > 0 && (
                  <span className="text-sm text-gray-600">({formData.rating} star{formData.rating !== 1 ? 's' : ''})</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Feedback Message *</Label>
              <Textarea
                id="message"
                placeholder="Share your experience working on this project..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                maxLength={500}
                rows={4}
              />
              <div className="text-sm text-gray-500 text-right">
                {formData.message.length}/500 characters
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.is_anonymous}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, is_anonymous: checked as boolean }))
                }
              />
              <Label htmlFor="anonymous" className="text-sm">
                Submit this feedback anonymously
              </Label>
            </div>

            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default WriteFeedbackTab;
