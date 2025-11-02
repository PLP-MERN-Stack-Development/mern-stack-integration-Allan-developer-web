import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { PostsProvider } from './context/PostsContext'
import Nav from './components/Nav'
import PostList from './components/PostList'
import PostView from './components/PostView'
import PostForm from './components/PostForm'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  return (
    <BrowserRouter>
      <PostsProvider>
        <Nav />
        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/new" element={<PostForm />} />
            <Route path="/posts/:id/edit" element={<PostForm />} />
            <Route path="/posts/:id" element={<PostView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </PostsProvider>
    </BrowserRouter>
  )
}

export default App
