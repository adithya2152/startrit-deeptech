import { useState } from 'react';
import PostApostForm from '@/components/posts/PostApostForm';
import BrowsePosts from '@/components/posts/BrowsePosts';
import YourPosts from '@/components/posts/YourPosts';

const tabs = [
  { id: 'create', label: 'Create Post' },
  { id: 'browse', label: 'Browse Posts' },
  { id: 'yours', label: 'Your Posts' },
];

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="posts-page-container max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Community Posts</h1>

      {/* Tabs Buttons */}
      <div className="flex space-x-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md font-semibold
              ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'create' && <PostApostForm />}
        {activeTab === 'browse' && <BrowsePosts />}
        {activeTab === 'yours' && <YourPosts />}
      </div>
    </div>
  );
}
