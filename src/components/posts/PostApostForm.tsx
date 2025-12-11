import { useState } from 'react';

export default function PostApostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      setTitle('');
      setContent('');
      alert('Post created!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="post-form max-w-xl mx-auto bg-white p-6 rounded-md shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create a Post</h2>

      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <textarea
        placeholder="Your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={5}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        type="submit"
        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition"
      >
        Post
      </button>
    </form>
  );
}
