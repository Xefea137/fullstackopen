import { useDispatch } from 'react-redux'
import { createComment } from '../reducers/commentReducer'
import useField from '../hooks/useField'
import { Button, TextField } from '@mui/material'

const AddCommentForm = ({ id }) => {
  const { reset: resetComment, ...comment } = useField('text')
  const dispatch = useDispatch()

  const onSubmit = async (event) => {
    event.preventDefault()
    if (comment.value.trim()) {
      dispatch(createComment(id, comment.value))
    }
    resetComment()
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <TextField
          {...comment}
          placeholder='add comment here'
          variant='outlined'
          fullWidth
          color="secondary"
          sx={{ marginBottom: .5 }}
        />
        <Button variant='contained' color='primary' type='submit' size='small'>Add comment</Button>
      </form>
    </div>
  )
}

export default AddCommentForm