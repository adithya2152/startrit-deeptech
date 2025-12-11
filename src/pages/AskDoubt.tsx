
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostDoubtForm from '@/components/doubts/PostDoubtForm';
import BrowseDoubts from '@/components/doubts/BrowseDoubts';
import YourDoubts from '@/components/doubts/YourDoubts';
import { MessageSquare, Plus, User } from 'lucide-react';

const AskDoubt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask Doubt</h1>
            <p className="text-gray-600">
              Get help from the deeptech developer community. Ask questions, share knowledge, and solve problems together.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Browse Doubts
              </TabsTrigger>
              <TabsTrigger value="post" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Post a Doubt
              </TabsTrigger>
              <TabsTrigger value="yours" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Doubts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <BrowseDoubts />
            </TabsContent>

            <TabsContent value="post">
              <PostDoubtForm onSuccess={() => setActiveTab('yours')} />
            </TabsContent>

            <TabsContent value="yours">
              <YourDoubts />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AskDoubt;
