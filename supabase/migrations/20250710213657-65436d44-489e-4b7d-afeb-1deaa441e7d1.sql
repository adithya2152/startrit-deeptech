
-- Create projects table to track project completion status
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  budget_min DECIMAL,
  budget_max DECIMAL,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create proposals table for developer bids
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_amount DECIMAL NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, developer_id)
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  giver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, giver_id, receiver_id)
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view projects they're involved in" ON public.projects
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = developer_id);

CREATE POLICY "Clients can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update projects they're involved in" ON public.projects
  FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = developer_id);

-- RLS Policies for proposals
CREATE POLICY "Users can view proposals for their projects" ON public.proposals
  FOR SELECT USING (
    auth.uid() = developer_id OR 
    auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
  );

CREATE POLICY "Developers can create proposals" ON public.proposals
  FOR INSERT WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can update their proposals" ON public.proposals
  FOR UPDATE USING (auth.uid() = developer_id);

-- RLS Policies for feedback
CREATE POLICY "Users can view feedback they gave or received" ON public.feedback
  FOR SELECT USING (auth.uid() = giver_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create feedback for completed projects" ON public.feedback
  FOR INSERT WITH CHECK (
    auth.uid() = giver_id AND
    project_id IN (
      SELECT id FROM public.projects 
      WHERE status = 'completed' AND 
      (client_id = auth.uid() OR developer_id = auth.uid())
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
