import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteBlog, updateBlog } from '../reducers/blogReducer'
import { initializeComments, resetComment } from '../reducers/commentReducer'
import AddCommentForm from './AddCommentForm'
import { Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import TripOriginIcon from '@mui/icons-material/TripOrigin'

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
      <Typography variant='h3'>{blog.title} by {blog.author}</Typography>
      <Typography component="a" href={blog.url} target='_blank'>{blog.url}</Typography>
      <Typography variant='body1' sx={{ marginBottom: 1, marginTop: 1 }}>
        {blog.likes} likes <Button variant='contained' color='primary' size='small' onClick={handleLike}>Like</Button>
      </Typography>
      <Typography variant='body1' gutterBottom>Added by {blog.user.name}</Typography>
      {user.username === blog.user.username && (
        <Button
          variant='contained'
          color='primary'
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          size='small'
          sx={{ backgroundColor: '#ff8b94' }}>
          Delete
        </Button>
      )}
      <Typography variant='h5' sx={{ marginTop: 3 }}>Comments</Typography>
      <AddCommentForm id={id} />
      <List>
        {comments.map(comment => (
          <ListItem key={comment.id} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <TripOriginIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{comment.comment}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default BlogDetail