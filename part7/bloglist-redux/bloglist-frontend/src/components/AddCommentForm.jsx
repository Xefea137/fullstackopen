import { useDispatch } from 'react-redux'
import { createComment } from '../reducers/commentReducer'
import useField from '../hooks/useField'

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
        <input
          {...comment}
          placeholder='add comment here'
        />
        <button type='submit'>Add comment</button>
      </form>
    </div>
  )
}

export default AddCommentForm