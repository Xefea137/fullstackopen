import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($author: String, $genre: String)
  {
    allBooks(
      author: $author
      genre: $genre
    ) {
      title
      published
      author {
        name
        born
        id
        bookCount
      }
      id
      genres
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!)
  {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
        title
        author {
          name
          born
          id
        }
        published
        genres
        id
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($name: String!, $setBornTo: Int!)
  {
    editAuthor(
      name: $name
      setBornTo: $setBornTo
    ) {
        name
        born
        id
        bookCount
      }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      id
      username
      favoriteGenre    
    }
  }
`