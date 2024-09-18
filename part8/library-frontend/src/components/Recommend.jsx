import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Recommend = ({ favoriteGenre }) => {
  const recommendedBooks = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre
  })

  if (recommendedBooks.loading) {
    return <div>Loading...</div>
  }

  const books = recommendedBooks.data ? recommendedBooks.data.allBooks : []

  if (books.length === 0) {
    return <div>No books found in the genre {favoriteGenre}</div>
  }
  
  return (
    <div>
      <h2>Recommendations</h2>
      Books in your favorite genre <strong>{favoriteGenre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {recommendedBooks.data.allBooks.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend