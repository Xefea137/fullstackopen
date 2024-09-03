import { useEffect, useRef, useContext } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import { useNotificationDispatch, useNotificationValue } from './contexts/NotificationContex'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import UserContext from './contexts/UserContex'

const App = () => {
  const [userValue, userDispatch] = useContext(UserContext)
  const notificationValue = useNotificationValue()
  const notificationDispatch = useNotificationDispatch()
  const blogFormRef = useRef()
  const queryClient = useQueryClient()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [userDispatch])

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    }
  })

  const blogLikeMutation = useMutation({
    mutationFn: ({ id, blogObject }) => blogService.update(id, blogObject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const blogRemoveMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const blogResult = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })

  if (blogResult.isLoading) {
    return <div>Loading data...</div>
  }

  if (blogResult.isError) {
    return <h1>Blog service not available due to problems in server!</h1>
  }

  const blogs = blogResult.data.sort((a, b) => b.likes - a.likes)

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
    } catch (exception) {
      notificationDispatch({ type: 'SHOW_NOTIFICATION', payload: { message: exception.response.data.error, type: 'error' } })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE_NOTIFICATION' })
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blogObject)
    notificationDispatch({ type: 'SHOW_NOTIFICATION', payload: {
      message: `A new blog ${blogObject.title} by ${blogObject.author} added`,
      type: 'success'
    } })
    setTimeout(() => {
      notificationDispatch({ type: 'HIDE_NOTIFICATION' })
    }, 5000)
  }

  const addLikes = (id, blogObject) => {
    blogLikeMutation.mutate({ id, blogObject })
  }

  const removeBlog = async (id) => {
    blogRemoveMutation.mutate(id)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'CLEAR_USER' })
    //setUser(null)
  }

  return (
    <div>
      <Notification message={notificationValue.message} type={notificationValue.type} />
      {!userValue && <LoginForm handleLogin={handleLogin} />}
      {userValue && (
        <div>
          <h2>Blogs</h2>
          <p>{userValue.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel='New blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} addLikes={addLikes} removeBlog={removeBlog} user={userValue} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App