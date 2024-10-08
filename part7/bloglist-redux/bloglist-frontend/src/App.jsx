import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import Notification from './components/Notification'
import Users from './components/User'
import BlogList from './components/BlogList'
import SingleUserBlogList from './components/SingleUserBlogList'
import BlogDetail from './components/BlogDetail'
import LoginForm from './components/LoginForm'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { initializeAllUsers } from './reducers/allUsersReducer'
import Menu from './components/Menu'
import { Container, Typography } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()
  const currentNotification = useSelector(state => state.notification)
  const loggedUser = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeAllUsers())
  }, [dispatch])

  return (
    <Container>
      <Menu />
      <Typography variant='h3' sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }} gutterBottom>Blog App</Typography>
      <Notification
        message={currentNotification.message}
        type={currentNotification.type}
      />
      <Routes>
        <Route path='/' element={loggedUser ? <BlogList /> : <Navigate replace to='/login' />} />
        <Route path='/blogs/:id' element={<BlogDetail /> } />
        <Route path='/users' element={<Users /> } />
        <Route path='/users/:id' element={<SingleUserBlogList /> } />
        <Route path='/login' element={!loggedUser ? <LoginForm /> : <Navigate replace to='/' /> } />
      </Routes>
    </Container>
  )
}

export default App