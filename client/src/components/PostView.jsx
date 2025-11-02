import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    postService
      .getPost(id)
      .then((res) => {
        if (mounted) setPost(res.data || res);
      })
      .catch((err) => setError(err))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
