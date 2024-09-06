import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../reducers/userReducer'
import { Link, useNavigate } from 'react-router-dom'

const Menu = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedUser = useSelector(state => state.user)

  const padding = {
    padding: 5
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
    navigate('/login')
  }

  return (
    <div>
      {loggedUser ? (
        <div>
          <Link style={padding} to='/'>Blogs</Link>
          <Link style={padding} to='/users'>Users</Link>
          <span>{loggedUser.name} logged in </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Link style={padding} to="/login">Login</Link>
      )}
    </div>
  )
}

export default Menu