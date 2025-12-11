
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Paperclip } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import type { Message } from '@/pages/Inbox';

interface MessageViewProps {
  conversationId: string;
  currentUserId: string;
  otherUser?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    profile_picture_url: string | null;
  };
}

const MessageView = ({ conversationId, currentUserId, otherUser }: MessageViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      
      // Optimistic update
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: newMessage.trim(),
        attachments: [],
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: newMessage.trim(),
        });

      if (error) {
        // Remove optimistic update on error
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        throw error;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(newMessage); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={otherUser?.profile_picture_url || undefined} 
              alt={`${otherUser?.first_name} ${otherUser?.last_name}`} 
            />
            <AvatarFallback>
              {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">
              {otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Unknown User'}
            </h3>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUserId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[40px] max-h-32 resize-none"
              disabled={sending}
            />
          </div>
          <div className="flex space-x-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="p-2"
              disabled={sending}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!newMessage.trim() || sending}
              className="p-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageView;
