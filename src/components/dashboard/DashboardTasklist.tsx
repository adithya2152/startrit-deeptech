import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2, Calendar, CheckSquare, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type Tasklist = Tables<'tasklists'>;
type Task = Tables<'tasks'>;

const DashboardTasklist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasklists, setTasklists] = useState<Tasklist[]>([]);
  const [selectedTasklist, setSelectedTasklist] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Form states
  const [newTasklistName, setNewTasklistName] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
    assigned_to: ''
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isTasklistDialogOpen, setIsTasklistDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasklists();
    }
  }, [user]);

  useEffect(() => {
    if (selectedTasklist) {
      fetchTasks(selectedTasklist);
    }
  }, [selectedTasklist]);

  const fetchTasklists = async () => {
    try {
      const { data, error } = await supabase
        .from('tasklists')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasklists(data);
      
      // Select the first tasklist by default
      if (data.length > 0 && !selectedTasklist) {
        setSelectedTasklist(data[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tasklists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (tasklistId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('tasklist_id', tasklistId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    }
  };

  const createTasklist = async () => {
    if (!newTasklistName.trim()) {
      toast({
        title: "Error",
        description: "Tasklist name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasklists')
        .insert([{
          name: newTasklistName,
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTasklists([data, ...tasklists]);
      setNewTasklistName('');
      setIsTasklistDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Tasklist created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create tasklist",
        variant: "destructive",
      });
    }
  };

  const deleteTasklist = async (tasklistId: string) => {
    try {
      const { error } = await supabase
        .from('tasklists')
        .delete()
        .eq('id', tasklistId);

      if (error) throw error;
      
      setTasklists(tasklists.filter(tl => tl.id !== tasklistId));
      if (selectedTasklist === tasklistId) {
        setSelectedTasklist(tasklists.length > 1 ? tasklists[0].id : null);
      }
      
      toast({
        title: "Success",
        description: "Tasklist deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete tasklist",
        variant: "destructive",
      });
    }
  };

  const createOrUpdateTask = async () => {
    if (!taskForm.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const taskData = {
        title: taskForm.title,
        description: taskForm.description || null,
        due_date: taskForm.due_date || null,
        status: taskForm.status,
        assigned_to: taskForm.assigned_to || null,
        tasklist_id: selectedTasklist
      };

      let result;
      if (editingTask) {
        result = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editingTask.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('tasks')
          .insert([taskData])
          .select()
          .single();
      }

      if (result.error) throw result.error;
      
      await fetchTasks(selectedTasklist!);
      resetTaskForm();
      setIsTaskDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Task ${editingTask ? 'updated' : 'created'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${editingTask ? 'update' : 'create'} task`,
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      setTasks(tasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Success",  
        description: "Task deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      due_date: '',
      status: 'pending',
      assigned_to: ''
    });
    setEditingTask(null);
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      due_date: task.due_date || '',
      status: task.status as 'pending' | 'in_progress' | 'completed',
      assigned_to: task.assigned_to || ''
    });
    setIsTaskDialogOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasklist</h1>
        <Dialog open={isTasklistDialogOpen} onOpenChange={setIsTasklistDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tasklist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tasklist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tasklistName">Tasklist Name</Label>
                <Input
                  id="tasklistName"
                  value={newTasklistName}
                  onChange={(e) => setNewTasklistName(e.target.value)}
                  placeholder="Enter tasklist name"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsTasklistDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createTasklist}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tasklists Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tasklists</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasklists.map((tasklist) => (
                <div
                  key={tasklist.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                    selectedTasklist === tasklist.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedTasklist(tasklist.id)}
                >
                  <span className="font-medium">{tasklist.name}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tasklist</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{tasklist.name}"? This will also delete all tasks in this tasklist.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTasklist(tasklist.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Tasks Area */}
        <div className="lg:col-span-3">
          {selectedTasklist ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {tasklists.find(tl => tl.id === selectedTasklist)?.name} Tasks
                  </CardTitle>
                  <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetTaskForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="taskTitle">Title *</Label>
                          <Input
                            id="taskTitle"
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                            placeholder="Enter task title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="taskDescription">Description</Label>
                          <Textarea
                            id="taskDescription"
                            value={taskForm.description}
                            onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                            placeholder="Enter task description"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="taskDueDate">Due Date</Label>
                            <Input
                              id="taskDueDate"
                              type="date"
                              value={taskForm.due_date}
                              onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="taskStatus">Status</Label>
                            <Select value={taskForm.status} onValueChange={(value: 'pending' | 'in_progress' | 'completed') => setTaskForm({...taskForm, status: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={createOrUpdateTask}>
                            {editingTask ? 'Update' : 'Create'} Task
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Search and Filter */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks found</p>
                    <p className="text-sm">Create your first task to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-gray-900">{task.title}</h3>
                              <Badge className={getStatusColor(task.status)}>
                                {getStatusText(task.status)}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {task.due_date && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {task.assigned_to && (
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>Assigned to: {task.assigned_to}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editTask(task)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{task.title}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteTask(task.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Select a tasklist to view tasks</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTasklist;
