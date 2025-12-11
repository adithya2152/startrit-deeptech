
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';

interface StartConversationButtonProps {
  targetUserId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  children?: React.ReactNode;
}

const StartConversationButton = ({ 
  targetUserId, 
  variant = 'default', 
  size = 'default',
  children 
}: StartConversationButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { createOrGetConversation } = useConversations();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartConversation = async () => {
    if (!user || user.id === targetUserId) return;

    try {
      setLoading(true);
      const conversationId = await createOrGetConversation(targetUserId);
      
      if (conversationId) {
        navigate(`/inbox?conversation=${conversationId}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStartConversation}
      disabled={loading || !user || user.id === targetUserId}
      variant={variant}
      size={size}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      {children || 'Message'}
    </Button>
  );
};

export default StartConversationButton;
