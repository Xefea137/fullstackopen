import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteBlog, updateBlog } from '../reducers/blogReducer'
import { initializeComments, resetComment } from '../reducers/commentReducer'
import AddCommentForm from './AddCommentForm'

const BlogDetail = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const comments = useSelector(state => state.comments)

  useEffect(() => {
    dispatch(resetComment())
    dispatch(initializeComments(id))
  }, [dispatch, id])

  if (!blog || !user) {
    return null
  }

  const handleLike = async () => {
    const blogObject = {
      ...blog,
      likes: blog.likes + 1,
    }
    dispatch(updateBlog(id, blogObject))
  }

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    )
    if (confirmDelete) {
      dispatch(deleteBlog(id))
      navigate('/')
    }
  }

  return (
    <div>
      <h1>{blog.title} by {blog.author}</h1>
      <a href={blog.url}>{blog.url}</a>
      <div>{blog.likes} likes <button onClick={handleLike}>Like</button></div>
      <div>Added by {blog.user.name}</div>
      {user.username === blog.user.username && (
        <button onClick={handleDelete}>Delete</button>
      )}
      <h3>Comments</h3>
      <AddCommentForm id={id} />
      <ul>
        {comments.map(comment =>
          <li key={comment.id}>{comment.comment}</li>
        )}
      </ul>
    </div>
  )
}

export default BlogDetail