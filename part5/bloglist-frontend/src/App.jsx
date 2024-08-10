import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [showNotification, setShowNotification] = useState({ message: null, type: null })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(blogs)
      }
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setShowNotification({ message: exception.response.data.error, type: 'error' })
      setTimeout(() => {
        setShowNotification({ message: null, type: null })
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setShowNotification({ message: `A new blog ${blogObject.title} by ${blogObject.author} added`, type: 'success' })
        setTimeout(() => {
          setShowNotification({ message: null, type: null })
        }, 5000)
      })
  }

  const addLikes = async (id, blogObject) => {
    const updatedBlog = await blogService.update(id, blogObject)
    setBlogs(likedBlog =>
      likedBlog
        .map(blog => blog.id !== id ? blog : updatedBlog)
        .sort((a, b) => b.likes - a.likes)
    )
  }

  const removeBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      <Notification message={showNotification.message} type={showNotification.type} />
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && (
        <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel='New blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} addLikes={addLikes} removeBlog={removeBlog} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App