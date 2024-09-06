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
      <h2>Create new</h2>
      <div>
        Title:
        <input
          {...title}
          data-testid="title"
          name="title"
          placeholder="add title here"
        />
      </div>
      <div>
        Author:
        <input
          {...author}
          data-testid="author"
          name="author"
          placeholder="add author here"
        />
      </div>
      <div>
        Url:
        <input
          {...url}
          data-testid="url"
          name="url"
          placeholder="add url here"
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm