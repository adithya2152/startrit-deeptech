
-- Create table for conversations
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_1 UUID REFERENCES auth.users NOT NULL,
  participant_2 UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(participant_1, participant_2),
  CHECK (participant_1 != participant_2)
);

-- Create table for messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view conversations they're part of" 
  ON public.conversations 
  FOR SELECT 
  USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can create conversations" 
  ON public.conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can update conversations they're part of" 
  ON public.conversations 
  FOR UPDATE 
  USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" 
  ON public.messages 
  FOR SELECT 
  USING (conversation_id IN (
    SELECT id FROM public.conversations 
    WHERE auth.uid() = participant_1 OR auth.uid() = participant_2
  ));

CREATE POLICY "Users can send messages in their conversations" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE auth.uid() = participant_1 OR auth.uid() = participant_2
    )
  );

CREATE POLICY "Users can update their own messages" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = sender_id);

-- Add triggers to update timestamps
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update conversation last_message_at when a message is sent
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations 
  SET 
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp on new message
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Enable realtime for conversations and messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Set replica identity for realtime updates
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Function to get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
  ordered_user1 UUID;
  ordered_user2 UUID;
BEGIN
  -- Order users to ensure consistent participant_1 and participant_2
  IF user1_id < user2_id THEN
    ordered_user1 := user1_id;
    ordered_user2 := user2_id;
  ELSE
    ordered_user1 := user2_id;
    ordered_user2 := user1_id;
  END IF;
  
  -- Try to find existing conversation
  SELECT id INTO conversation_id
  FROM public.conversations
  WHERE participant_1 = ordered_user1 AND participant_2 = ordered_user2;
  
  -- If not found, create new conversation
  IF conversation_id IS NULL THEN
    INSERT INTO public.conversations (participant_1, participant_2)
    VALUES (ordered_user1, ordered_user2)
    RETURNING id INTO conversation_id;
  END IF;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
