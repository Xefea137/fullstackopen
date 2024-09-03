import { createSlice } from '@reduxjs/toolkit'

const initialState = { type: null, message: null }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      const { message, type } = action.payload
      state.type = type,
      state.message = message
    },
    hideNotification(state) {
      state.type = null,
      state.message = null
    }
  }
})

export const { showNotification, hideNotification } = notificationSlice.actions

export const setNotification = (message, type) => {
  return dispatch => {
    dispatch(showNotification({
      type,
      message
    }))
    setTimeout(() => {
      dispatch(hideNotification())
    }, 5000)
  }
}

export default notificationSlice.reducer

/*
const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SHOW_NOTIFICATION':
    return action.payload
  case 'HIDE_NOTIFICATION':
    return initialState
  default:
    return state
  }
}

export const showNotification = ({ type, message }) => {
  return {
    type: 'SHOW_NOTIFICATION',
    payload: {
      type,
      message
    }
  }
}

export const hideNotification = () => {
  return {
    type: 'HIDE_NOTIFICATION'
  }
}

export default notificationReducer
*/