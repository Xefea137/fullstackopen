import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, CREATE_BOOK } from '../queries'
import UpdateCache from './UpdateCache'

const NewBook = ({ setNotify }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      const message = error.graphQLErrors.map(e => e.message).join('\n')
      setNotify(message, 'red')
    },
    update: (cache, response) => {
      UpdateCache(cache, { query: ALL_BOOKS }, response.data.bookAdded)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    createBook({ variables: { title, author, published: +published, genres }})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add book</h2>
      <form onSubmit={submit}>
        <div>
          Title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            Add genre
          </button>
        </div>
        <div>Genres: {genres.join(' ')}</div>
        <button type="submit">Create book</button>
      </form>
    </div>
  )
}

export default NewBook