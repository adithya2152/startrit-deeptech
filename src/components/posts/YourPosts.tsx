import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function YourPosts() {
  const { user } = useAuth(); // ensure this hook returns user.id
  const [yourPosts, setYourPosts] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/posts?authorId=${user.id}`)
      .then((res) => res.json())
      .then(setYourPosts);
  }, [user]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setYourPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="your-posts space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Posts</h2>
      {yourPosts.length === 0 && (
        <p className="text-gray-500">You have not posted anything yet.</p>
      )}
      {yourPosts.map((post) => (
        <div
          key={post.id}
          className="post-card p-4 border border-gray-200 rounded-md shadow-sm bg-white"
        >
          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
          <p className="text-gray-700 mt-2">{post.content.slice(0, 100)}...</p>
          <button
            onClick={() => handleDelete(post.id)}
            className="mt-4 inline-block bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
