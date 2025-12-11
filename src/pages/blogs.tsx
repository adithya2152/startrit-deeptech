import CreateBlogForm from '@/components/blogs/CreateBlogForm';
import BrowseBlogs from '@/components/blogs/BrowseBlogs';
import YourBlogs from '@/components/blogs/YourBlogs';
import { useState } from 'react';

export default function BlogsPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'browse' | 'your'>('browse');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Blogs</h1>

      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'create'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Create Blog
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'browse'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Browse Blogs
        </button>
        <button
          onClick={() => setActiveTab('your')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'your'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Your Blogs
        </button>
      </div>

      {activeTab === 'create' && <CreateBlogForm />}
      {activeTab === 'browse' && <BrowseBlogs />}
      {activeTab === 'your' && <YourBlogs />}
    </div>
  );
}
