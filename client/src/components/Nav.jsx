import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '../services/api';

export default function Nav() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const onAuth = () => setUser(authService.getCurrentUser());
    window.addEventListener('authChanged', onAuth);
    return () => window.removeEventListener('authChanged', onAuth);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.dispatchEvent(new Event('authChanged'));
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link>
      {' | '}
      <Link to="/posts/new">Create Post</Link>
      {' | '}
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          {' | '}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          {' | '}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
