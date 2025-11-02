import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';

export default function PostList() {
  const { posts, loading, error } = usePosts();

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts</p>;

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts && posts.length ? (
          posts.map((p) => (
            <li key={p._id}>
              <Link to={`/posts/${p._id}`}>{p.title}</Link>
            </li>
          ))
        ) : (
          <li>No posts yet</li>
        )}
      </ul>
    </div>
  );
}
