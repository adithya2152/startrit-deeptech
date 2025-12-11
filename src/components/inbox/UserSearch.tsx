
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, MessageSquare, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';

interface UserSearchResult {
  id: string;
  first_name: string | null;
  last_name: string | null;
  profile_picture_url: string | null;
  user_id: string;
  public_user_id: string | null;
}

interface UserSearchProps {
  onConversationCreated: (conversationId: string) => void;
}

const UserSearch = ({ onConversationCreated }: UserSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);
  const { createOrGetConversation } = useConversations();
  const { user } = useAuth();

  const searchUsers = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, public_user_id, first_name, last_name, profile_picture_url')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,public_user_id.eq.${query}`)
        .neq('user_id', user?.id) // Exclude current user
        .not('public_user_id', 'is', null) // Only show users with public_user_id
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    searchUsers(value);
  };

  const startConversation = async (targetUserId: string) => {
    if (!user || creating) return;

    try {
      setCreating(targetUserId);
      const conversationId = await createOrGetConversation(targetUserId);
      
      if (conversationId) {
        onConversationCreated(conversationId);
        setIsOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setCreating(null);
    }
  };

  const getUserDisplayName = (user: UserSearchResult) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.public_user_id || 'Unknown User';
  };

  const getUserInitials = (user: UserSearchResult) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.public_user_id?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Start New Conversation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search by name or Gmail prefix (e.g., john.doe)..."
              value={searchQuery}
              onValueChange={handleSearch}
            />
            <CommandList>
              {loading && (
                <div className="p-4 text-center text-sm text-gray-500">
                  Searching...
                </div>
              )}
              {!loading && searchQuery && searchResults.length === 0 && (
                <CommandEmpty>No users found.</CommandEmpty>
              )}
              {!loading && searchResults.length > 0 && (
                <CommandGroup>
                  {searchResults.map((userResult) => (
                    <CommandItem
                      key={userResult.user_id}
                      className="flex items-center justify-between p-3 cursor-pointer"
                      onSelect={() => startConversation(userResult.user_id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userResult.profile_picture_url || undefined} />
                          <AvatarFallback>{getUserInitials(userResult)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {getUserDisplayName(userResult)}
                          </p>
                          <p className="text-xs text-gray-500">
                            @{userResult.public_user_id}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={creating === userResult.user_id}
                        className="h-8"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {creating === userResult.user_id ? 'Starting...' : 'Message'}
                      </Button>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSearch;
