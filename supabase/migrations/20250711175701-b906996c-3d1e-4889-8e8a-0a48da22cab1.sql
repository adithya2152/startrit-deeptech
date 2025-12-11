
-- Create project_updates table
CREATE TABLE public.project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  developer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create update_comments table for client comments
CREATE TABLE public.update_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id UUID REFERENCES public.project_updates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.update_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_updates
CREATE POLICY "Developers can create updates for their projects" ON public.project_updates
  FOR INSERT WITH CHECK (
    auth.uid() = developer_id AND
    project_id IN (
      SELECT id FROM public.projects 
      WHERE developer_id = auth.uid() AND status = 'in_progress'
    )
  );

CREATE POLICY "Project participants can view updates" ON public.project_updates
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE client_id = auth.uid() OR developer_id = auth.uid()
    )
  );

CREATE POLICY "Developers can update their own updates within 24 hours" ON public.project_updates
  FOR UPDATE USING (
    auth.uid() = developer_id AND
    created_at > NOW() - INTERVAL '24 hours'
  );

CREATE POLICY "Developers can delete their own updates within 24 hours" ON public.project_updates
  FOR DELETE USING (
    auth.uid() = developer_id AND
    created_at > NOW() - INTERVAL '24 hours'
  );

-- RLS Policies for update_comments
CREATE POLICY "Clients can create comments on project updates" ON public.update_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    update_id IN (
      SELECT pu.id FROM public.project_updates pu
      JOIN public.projects p ON pu.project_id = p.id
      WHERE p.client_id = auth.uid()
    )
  );

CREATE POLICY "Project participants can view comments" ON public.update_comments
  FOR SELECT USING (
    update_id IN (
      SELECT pu.id FROM public.project_updates pu
      JOIN public.projects p ON pu.project_id = p.id
      WHERE p.client_id = auth.uid() OR p.developer_id = auth.uid()
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_project_updates_updated_at
  BEFORE UPDATE ON public.project_updates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
