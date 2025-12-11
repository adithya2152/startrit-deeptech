
-- Create table for doubts (questions)
CREATE TABLE public.doubts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  domain TEXT,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for answers
CREATE TABLE public.doubt_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doubt_id UUID REFERENCES public.doubts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for answer votes
CREATE TABLE public.answer_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id UUID REFERENCES public.doubt_answers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(answer_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doubts
CREATE POLICY "Anyone can view doubts" 
  ON public.doubts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create doubts" 
  ON public.doubts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doubts" 
  ON public.doubts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own doubts" 
  ON public.doubts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for doubt_answers
CREATE POLICY "Anyone can view answers" 
  ON public.doubt_answers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create answers" 
  ON public.doubt_answers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers" 
  ON public.doubt_answers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answers" 
  ON public.doubt_answers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for answer_votes
CREATE POLICY "Anyone can view votes" 
  ON public.answer_votes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can vote" 
  ON public.answer_votes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
  ON public.answer_votes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
  ON public.answer_votes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at column
CREATE TRIGGER update_doubts_updated_at
  BEFORE UPDATE ON public.doubts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doubt_answers_updated_at
  BEFORE UPDATE ON public.doubt_answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update answer vote counts
CREATE OR REPLACE FUNCTION update_answer_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE public.doubt_answers 
      SET upvotes = upvotes + 1 
      WHERE id = NEW.answer_id;
    ELSE
      UPDATE public.doubt_answers 
      SET downvotes = downvotes + 1 
      WHERE id = NEW.answer_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE public.doubt_answers 
      SET upvotes = upvotes - 1 
      WHERE id = OLD.answer_id;
    ELSE
      UPDATE public.doubt_answers 
      SET downvotes = downvotes - 1 
      WHERE id = OLD.answer_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle vote type change
    IF OLD.vote_type = 'upvote' AND NEW.vote_type = 'downvote' THEN
      UPDATE public.doubt_answers 
      SET upvotes = upvotes - 1, downvotes = downvotes + 1 
      WHERE id = NEW.answer_id;
    ELSIF OLD.vote_type = 'downvote' AND NEW.vote_type = 'upvote' THEN
      UPDATE public.doubt_answers 
      SET upvotes = upvotes + 1, downvotes = downvotes - 1 
      WHERE id = NEW.answer_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote counting
CREATE TRIGGER answer_votes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.answer_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_answer_votes();
