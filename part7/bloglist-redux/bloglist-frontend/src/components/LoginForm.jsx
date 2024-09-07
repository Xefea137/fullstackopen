import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import { Box, Button, Container, TextField, Typography } from '@mui/material'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSubmit = async (event) => {
    event.preventDefault()
    await handleLogin({
      username,
      password,
    })
    navigate('/')
    setUsername('')
    setPassword('')
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'error'))
    }
  }

  return (
    <Container maxWidth='sm'>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          color: 'primary.main',
          border: 1,
          borderColor: '#61f4de',
          borderRadius: 1,
          padding: 3,
          backgroundColor: '#f5f5f5',
          boxShadow: 5,
          mx: 'auto',
          textAlign: 'center'
        }}
      >
        <Typography variant='h3' sx={{ marginBottom: 5 }}>Log in to application</Typography>
        <form onSubmit={onSubmit}>
          <div>
            <TextField
              label='Username'
              type='text'
              value={username}
              name='username'
              onChange={handleUsernameChange}
              variant='outlined'
              data-testid='username'
            />
          </div>
          <div>
            <TextField
              label='Password'
              type='password'
              value={password}
              name='password'
              onChange={handlePasswordChange}
              variant='outlined'
              data-testid='password'
              sx={{ marginTop:1, marginBottom: 1 }}
            />
          </div>
          <Button variant='contained' color='primary' fullWidth type='submit' >Login</Button>
        </form>
      </Box>
    </Container>
  )
}

export default LoginForm
