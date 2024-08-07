import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  return (
    <form onSubmit={addBlog} className='formDiv'>
      <h2>Create new</h2>
      <div>
        Title:
        <input
          type='text'
          value={newTitle}
          name='title'
          onChange={handleTitleChange}
          placeholder='add title here'
        />
      </div>
      <div>
        Author:
        <input
          type='text'
          value={newAuthor}
          name='author'
          onChange={handleAuthorChange}
          placeholder='add author here'
        />
      </div>
      <div>
        Url:
        <input
          type='text'
          value={newUrl}
          name='url'
          onChange={handleUrlChange}
          placeholder='add url here'
        />
      </div>
      <button type='submit'>Create</button>
    </form>
  )
}

export default BlogForm