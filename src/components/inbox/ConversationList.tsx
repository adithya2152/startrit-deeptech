
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import type { Conversation } from '@/pages/Inbox';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  currentUserId 
}: ConversationListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Start messaging by searching for users above</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation) => {
              const isSelected = selectedConversation === conversation.id;
              const otherUser = conversation.other_user;
              const lastMessage = conversation.last_message;
              const isLastMessageFromOther = lastMessage?.sender_id !== currentUserId;
              
              return (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={otherUser?.profile_picture_url || undefined} 
                          alt={`${otherUser?.first_name} ${otherUser?.last_name}`} 
                        />
                        <AvatarFallback>
                          {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {/* Unread indicator */}
                      {isLastMessageFromOther && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium text-gray-900 truncate ${
                          isLastMessageFromOther ? 'font-semibold' : ''
                        }`}>
                          {otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Unknown User'}
                        </p>
                        {lastMessage && (
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                      
                      {lastMessage && (
                        <p className={`text-sm text-gray-600 truncate mt-1 ${
                          isLastMessageFromOther ? 'font-medium' : ''
                        }`}>
                          {lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
