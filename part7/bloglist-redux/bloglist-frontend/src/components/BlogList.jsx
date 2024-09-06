import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'

const HomePage = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`A new blog ${blogObject.title} by ${blogObject.author} added`, 'success'))
  }

  return (
    <div>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <Blog />
    </div>
  )
}

export default HomePage