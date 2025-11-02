import { createContext, useContext, useEffect, useState } from 'react';
import { postService, categoryService } from '../services/api';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await postService.getAllPosts();
      setPosts(data.data || data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data.data || data);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, setPosts, categories, loading, error, loadPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
