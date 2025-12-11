
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useConversations = () => {
  const { user } = useAuth();

  const createOrGetConversation = async (otherUserId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_or_create_conversation', {
        user1_id: user.id,
        user2_id: otherUserId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating/getting conversation:', error);
      return null;
    }
  };

  return {
    createOrGetConversation
  };
};
