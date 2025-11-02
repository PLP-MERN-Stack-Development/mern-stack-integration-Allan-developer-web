import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { postService } from '../services/api';

export default function PostForm() {
  const { id } = useParams();
  const { categories, loadPosts } = usePosts();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    postService
      .getPost(id)
      .then((res) => {
        const p = res.data || res;
        setForm({ title: p.title || '', content: p.content || '', category: p.category?._id || '' });
      })
      .catch((err) => setError(err));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await postService.updatePost(id, form);
      } else {
        await postService.createPost(form);
      }
      await loadPosts();
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Post' : 'Create Post'}</h2>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <div>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />
      </div>
      <div>
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Content</label>
        <textarea name="content" value={form.content} onChange={handleChange} />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
}
