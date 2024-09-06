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