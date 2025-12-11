import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_type: string;
  created_at: string;
}

export default function BrowsePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  return (
    <div className="browse-posts space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Browse All Posts</h2>

      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="post-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
            <p className="text-gray-600 mb-3">{post.content.slice(0, 100)}...</p>
            <div className="text-sm text-gray-500 flex justify-between">
              <span>
                By <span className="font-medium text-gray-700">{post.author_name}</span> ({post.author_type})
              </span>
              <span>{new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No posts found.</p>
      )}
    </div>
  );
}
