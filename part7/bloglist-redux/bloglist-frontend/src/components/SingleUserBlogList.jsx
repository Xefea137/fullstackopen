import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import TripOriginIcon from '@mui/icons-material/TripOrigin'

const SingleUserBlogs = () => {
  const allUsers = useSelector(state => state.allUsers)
  const id = useParams().id
  const user = allUsers.find(u => u.id === String(id))

  if (!user) {
    return null
  }

  return (
    <div>
      <Typography variant='h4'>{user.name}</Typography>
      <Typography variant='h6'>Added blogs</Typography>
      <List>
        {user.blogs.map(blog => (
          <ListItem key={blog.id} disablePadding>
            <ListItemButton>
              <ListItemIcon><TripOriginIcon fontSize='small' color='primary' /></ListItemIcon>
              <ListItemText>{blog.title}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default SingleUserBlogs