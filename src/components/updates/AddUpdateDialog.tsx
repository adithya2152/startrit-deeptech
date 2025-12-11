
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AddUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: any[];
  onUpdateAdded: () => void;
}

const AddUpdateDialog = ({ open, onOpenChange, projects, onUpdateAdded }: AddUpdateDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    attachments: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.project_id || !formData.title || !formData.description) return;

    setLoading(true);
    try {
      const attachmentsArray = formData.attachments
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const { error } = await supabase
        .from('project_updates')
        .insert({
          project_id: formData.project_id,
          developer_id: user.id,
          title: formData.title,
          description: formData.description,
          attachments: attachmentsArray,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project update added successfully",
      });

      setFormData({
        project_id: '',
        title: '',
        description: '',
        attachments: '',
      });
      onUpdateAdded();
    } catch (error) {
      console.error('Error adding update:', error);
      toast({
        title: "Error",
        description: "Failed to add project update",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Project Update</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="project">Project</Label>
            <Select value={formData.project_id} onValueChange={(value) => setFormData({...formData, project_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Update Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Completed user authentication module"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what you've accomplished, any challenges, and next steps..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="attachments">Attachments (URLs)</Label>
            <Textarea
              id="attachments"
              value={formData.attachments}
              onChange={(e) => setFormData({...formData, attachments: e.target.value})}
              placeholder="Add URLs to screenshots, documents, or other files (one per line)"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUpdateDialog;
