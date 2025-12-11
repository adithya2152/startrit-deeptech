import { useEffect, useState } from 'react';

interface Blog {
  id: string;
  title: string;
  content: string;
  cover_image_url?: string;
  tags?: string;
  author_name: string;
  author_type: string;
  created_at: string;
}

export default function BrowseBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then(setBlogs);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Browse All Blogs</h2>

      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2 text-gray-800">{blog.title}</h3>
            {blog.cover_image_url && (
              <img
                src={blog.cover_image_url}
                alt="cover"
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <p className="text-gray-600 mb-2">{blog.content.slice(0, 150)}...</p>
            {blog.tags && (
              <p className="text-sm text-blue-600 mb-2">Tags: {blog.tags}</p>
            )}
            <div className="text-sm text-gray-500 flex justify-between">
              <span>
                By <span className="font-medium text-gray-700">{blog.author_name}</span> ({blog.author_type})
              </span>
              <span>{new Date(blog.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No blogs found.</p>
      )}
    </div>
  );
}
