import { Button, TextField, Typography } from '@mui/material'
import useField from '../hooks/useField'

const BlogForm = ({ createBlog }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })
    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <form onSubmit={addBlog} className="formDiv">
      <Typography variant='h4' gutterBottom>Create new</Typography>
      <div>
        <TextField
          label='Title'
          {...title}
          data-testid="title"
          name="title"
          placeholder="add title here"
          variant='outlined'
          fullWidth
        />
      </div>
      <div>
        <TextField
          label='Author'
          {...author}
          data-testid="author"
          name="author"
          placeholder="add author here"
          variant='outlined'
          fullWidth
          sx={{ marginTop:1, marginBottom: 1 }}
        />
      </div>
      <div>
        <TextField
          label='Url'
          {...url}
          data-testid="url"
          name="url"
          placeholder="add url here"
          variant='outlined'
          fullWidth
        />
      </div>
      <Button variant='contained' color='primary' type='submit' sx={{ marginTop:1, marginBottom: 1 }}>Create</Button>
    </form>
  )
}

export default BlogForm