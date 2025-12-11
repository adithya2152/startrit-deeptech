
-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bookmark_type TEXT NOT NULL CHECK (bookmark_type IN ('project', 'developer', 'post', 'blog', 'task')),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID, -- Will reference posts table when created
  blog_id UUID, -- Will reference blogs table when created
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table (for social media style posts)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table (for long-form content)
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarks
CREATE POLICY "Users can create their own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for posts (public read, authenticated users can create)
CREATE POLICY "Anyone can view posts" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for blogs (public read, authenticated users can create)
CREATE POLICY "Anyone can view blogs" ON public.blogs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create blogs" ON public.blogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blogs" ON public.blogs
  FOR UPDATE USING (auth.uid() = user_id);

-- Add foreign key constraints for posts and blogs to bookmarks
ALTER TABLE public.bookmarks 
ADD CONSTRAINT bookmarks_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE public.bookmarks 
ADD CONSTRAINT bookmarks_blog_id_fkey 
FOREIGN KEY (blog_id) REFERENCES public.blogs(id) ON DELETE CASCADE;

-- Add triggers for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_type ON public.bookmarks(bookmark_type);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_blogs_user_id ON public.blogs(user_id);
