import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [showNotification, setShowNotification] = useState({ message: null, type: null })
  const [createBlogVisable, setCreateBlogVisable] = useState(false)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs)
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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
  
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
  
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')      
    } catch (exception) {
      setShowNotification({ message: exception.response.data.error, type: 'error' }) 
      setTimeout(() => {
        setShowNotification({ message: null, type: null })
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  const blogForm = () => {
    const hideWhenVisible = { display: createBlogVisable ? 'none' : '' }
    const showWhenVisible = { display: createBlogVisable ? '' : 'none'}

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateBlogVisable(true)}>New blog</button>
        </div>
        <div style={showWhenVisible}>
          <form onSubmit={addBlog}>
            <h2>Create new</h2>
            <div>
              Title:
              <input
                type='text'
                value={newTitle}
                name='title'
                onChange={handleTitleChange}
              />
            </div>
            <div>
              Author:
              <input
                type='text'
                value={newAuthor}
                name='author'
                onChange={handleAuthorChange}
              />
            </div>
            <div>
              Url:
              <input
                type='text'
                value={newUrl}
                name='url'
                onChange={handleUrlChange}
              />
            </div>
            <button type='submit'>create</button>
          </form>
          <button onClick={() => setCreateBlogVisable(false)}>Cancel</button>
        </div>
      </div>
    )
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setShowNotification({ message: `A new blog ${newTitle} by ${newAuthor} added`, type: 'success' }) 
        setTimeout(() => {
          setShowNotification({ message: null, type: null })
      }, 5000)
      })
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className={type}>
        {message}
      </div>
    )
  }

  return (
    <div>
      <Notification message={showNotification.message} type={showNotification.type} />
      {!user && loginForm()}
      {user && (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        {blogForm()}
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
      )}
    </div>
  )
}

export default App