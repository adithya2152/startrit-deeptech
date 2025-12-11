'use client';

import { useState } from 'react';

export default function CreateBlogForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/blogs', {
      method: 'POST',
      body: JSON.stringify({
        title,
        content,
        cover_image_url: coverImageUrl,
        tags,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      setTitle('');
      setContent('');
      setCoverImageUrl('');
      setTags('');
      alert('Blog posted!');
    }
  };

  return (
    <div className="create-blog-form bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Cover Image URL (optional)</label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. AI, Robotics, Startups"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your blog here..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
}
