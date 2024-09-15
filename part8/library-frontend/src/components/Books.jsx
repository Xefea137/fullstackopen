import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState } from "react"

const Books = ({ books }) => {
  const genres = [...new Set(books.map(b => b.genres).flat())]
  const [genre, setGenre] = useState(null)

  const booksFilter = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre
  })

  if (booksFilter.loading) {
    return <div>Loading...</div>
  }

  if (!books) {
    return null
  }

  const booksToShow = genre && booksFilter.data ? booksFilter.data.allBooks : books

  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {booksToShow.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(g => (
        <button key={g} onClick={() => setGenre(g)}>{g}</button>
      ))}
      <button onClick={() => setGenre(null)}>All genres</button>
    </div>
  )
}

export default Books
