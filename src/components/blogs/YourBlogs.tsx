import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function YourBlogs() {
  const { user } = useAuth();
  const [yourBlogs, setYourBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/blogs?authorId=${user.id}`)
      .then((res) => res.json())
      .then(setYourBlogs);
  }, [user]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setYourBlogs((prev) => prev.filter((b) => b.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Blogs</h2>

      {yourBlogs.length > 0 ? (
        yourBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2 text-gray-800">{blog.title}</h3>
            <p className="text-gray-600 mb-3">{blog.content.slice(0, 120)}...</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{new Date(blog.created_at).toLocaleString()}</span>
              <button
                onClick={() => handleDelete(blog.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">You haven't posted any blogs yet.</p>
      )}
    </div>
  );
}
