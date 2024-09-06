import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const commentSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {
    setComments (state, action) {
      return action.payload
    },
    addNewComment (state, action) {
      state.push(action.payload)
    },
    resetComment (state) {
      return []
    }
  }
})

export const { setComments, addNewComment, resetComment } = commentSlice.actions

export const initializeComments = id => {
  return async dispatch => {
    const comments = await blogService.getAllComments(id)
    dispatch(setComments(comments))
  }
}

export const createComment = (id, newComment) => {
  return async dispatch => {
    const addComment = await blogService.postComment(id, { comment: newComment })
    dispatch(addNewComment(addComment))
  }
}

export default commentSlice.reducer