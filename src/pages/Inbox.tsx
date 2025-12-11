
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ConversationList from '@/components/inbox/ConversationList';
import MessageView from '@/components/inbox/MessageView';
import UserSearch from '@/components/inbox/UserSearch';
import { supabase } from '@/integrations/supabase/client';

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  other_user?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    profile_picture_url: string | null;
  };
  last_message?: {
    content: string;
    sender_id: string;
    created_at: string;
  };
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments: string[];
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

const Inbox = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Handle conversation selection from URL params
  useEffect(() => {
    const conversationFromUrl = searchParams.get('conversation');
    if (conversationFromUrl) {
      setSelectedConversation(conversationFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (profile && !profile.is_completed) {
        navigate(`/profile-setup/${profile.setup_step || 1}`);
        return;
      }
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchConversations();
      subscribeToRealtime();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages!inner(content, sender_id, created_at)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get other users' profiles
      const otherUserIds = conversationsData?.map(conv => 
        conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1
      ) || [];

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, profile_picture_url')
        .in('user_id', otherUserIds);

      const conversationsWithProfiles: Conversation[] = conversationsData?.map(conv => {
        const otherUserId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
        const otherUserProfile = profilesData?.find(p => p.user_id === otherUserId);
        
        // Get latest message
        const latestMessage = conv.messages?.[conv.messages.length - 1];

        return {
          ...conv,
          other_user: otherUserProfile ? {
            id: otherUserId,
            first_name: otherUserProfile.first_name,
            last_name: otherUserProfile.last_name,
            profile_picture_url: otherUserProfile.profile_picture_url,
          } : undefined,
          last_message: latestMessage,
        };
      }) || [];

      setConversations(conversationsWithProfiles);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const subscribeToRealtime = () => {
    if (!user) return;

    const channel = supabase
      .channel('inbox_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant_1=eq.${user.id},participant_2=eq.${user.id}`,
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleConversationCreated = (conversationId: string) => {
    setSelectedConversation(conversationId);
    fetchConversations(); // Refresh the conversation list
  };

  if (loading || loadingConversations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inbox...</p>
        </div>
      </div>
    );
  }

  if (!user || (profile && !profile.is_completed)) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSectionChange = (section: string) => {
    switch (section) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'tasklist':
        navigate('/task-list');
        break;
      case 'projects':
        navigate('/my-projects');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      case 'updates':
        navigate('/project-updates');
        break;
      case 'bookmarks':
        navigate('/bookmarks');
        break;
      case 'inbox':
        // Already on inbox page
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar 
        activeSection="inbox"
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          user={user}
          profile={profile}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Left Panel - Conversations List */}
            <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <UserSearch onConversationCreated={handleConversationCreated} />
              </div>
              <div className="flex-1 overflow-hidden">
                <ConversationList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onSelectConversation={setSelectedConversation}
                  currentUserId={user.id}
                />
              </div>
            </div>

            {/* Right Panel - Message View */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <MessageView 
                  conversationId={selectedConversation}
                  currentUserId={user.id}
                  otherUser={conversations.find(c => c.id === selectedConversation)?.other_user}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inbox;
