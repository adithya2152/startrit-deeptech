
-- Create tasklists table
CREATE TABLE public.tasklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  tasklist_id UUID NOT NULL REFERENCES public.tasklists(id) ON DELETE CASCADE,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to tasklists
ALTER TABLE public.tasklists ENABLE ROW LEVEL SECURITY;

-- Create policies for tasklists
CREATE POLICY "Users can view their own tasklists" 
  ON public.tasklists 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasklists" 
  ON public.tasklists 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasklists" 
  ON public.tasklists 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasklists" 
  ON public.tasklists 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add Row Level Security (RLS) to tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view tasks in their tasklists" 
  ON public.tasks 
  FOR SELECT 
  USING (tasklist_id IN (SELECT id FROM public.tasklists WHERE user_id = auth.uid()));

CREATE POLICY "Users can create tasks in their tasklists" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (tasklist_id IN (SELECT id FROM public.tasklists WHERE user_id = auth.uid()));

CREATE POLICY "Users can update tasks in their tasklists" 
  ON public.tasks 
  FOR UPDATE 
  USING (tasklist_id IN (SELECT id FROM public.tasklists WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete tasks in their tasklists" 
  ON public.tasks 
  FOR DELETE 
  USING (tasklist_id IN (SELECT id FROM public.tasklists WHERE user_id = auth.uid()));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON public.tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
