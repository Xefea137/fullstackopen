import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../reducers/userReducer'
import { Link, useNavigate } from 'react-router-dom'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'

const Menu = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedUser = useSelector(state => state.user)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
    navigate('/login')
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        {loggedUser ? (
          <>
            <Button color='inherit' variant='contained' size='small' sx={{ marginRight: 1 }} component={Link} to='/'>Blogs</Button>
            <Button color='inherit' variant='contained' size='small' sx={{ marginRight: 1 }} component={Link} to='/users'>Users</Button>
            <Typography sx={{ flexGrow: 1, color: '#81c784', fontSize: '1.5rem', textAlign: 'center' }}>
              {loggedUser.name} logged in
            </Typography>
            <Button color='inherit' variant='contained' onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button color='inherit' variant='contained' component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Menu