const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('Connecting to ', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ', error.message)
  })

const typeDefs = `
type Author {
  name: String!
  born: Int
  id: ID!
  bookCount: Int!
}

type Book {
  title: String!
  published: Int!
  author: Author!
  id: ID!
  genres: [String!]!
}

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!      
    ): Book
    addAuthor(
      name: String!
      born: Int
    ): Author
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),

    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, { author, genre }) => {
      if (author && genre) {
        author = await Author.findOne({ name: author })
        const books = await Book.find({ author: author._id, genres: genre}).populate('author')
        if (!author || books.length === 0) {
          throw new GraphQLError('Book with those filters not available', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
        return books
      } else if (author) {
        author = await Author.findOne({ name: author })
        if (!author) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
        return Book.find({ author: author._id }).populate('author')
      } else if (genre) {
        const books = await Book.find({ genres: genre }).populate('author')
        if (books.length === 0) {
          throw new GraphQLError('No books found for the given genre', {
            extensions: {
              code: 'NOT_FOUND',
            }
          })
        }
        return books
      } else {
        return Book.find({}).populate('author')
      }
    },

    allAuthors: async () => Author.find({}),

    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root })
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (!args.title || !args.author || !args.published || args.genres.length === 0) {
        throw new GraphQLError('All data must be provided!', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      if (args.title.length < 5) {
        throw new GraphQLError('Title must be atleast 5 character long', {
          extensions: {
            code:'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      const existingBook = await Book.findOne({ title: args.title })
      if (existingBook) {
        throw new GraphQLError('Book already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }
      
      const existingAuthor = await Author.findOne({ name: args.author })
      if (!existingAuthor) {
        const newAuthor = new Author({ name: args.author })
        try {
          await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      
      const findAuthor = await Author.findOne({ name: args.author })      
      const book = new Book({ ...args, author: findAuthor._id })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
      
      return book
    },

    addAuthor: async (root, args) => {
      if (!args.name) {
        throw new GraphQLError('Author\'s name cannot be empty!', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (args.name.length < 4) {
        throw new GraphQLError('Author\'s name must be at least 4 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      const existingAuthor = await Author.findOne({ name: args.name })
      if (existingAuthor) {
        throw new GraphQLError('Author already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      const newAuthor = new Author({ ...args })

      try {
        newAuthor.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return newAuthor
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (!args.name || !args.setBornTo) {
        throw new GraphQLError('Provide all data!', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Editing birth year failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return author
    },

    createUser: async (root, args) => {
      if (!args.username || !args.favoriteGenre) {
        throw new GraphQLError('Username and favourite genre required', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const existingUser = await User.findOne({ username: args.username})
      if (existingUser) {
        throw new GraphQLError('Username already in use', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username
          }
        })
      }

      const user = new User({ ...args })

      return user.save()
        .catch (error => {
          throw new GraphQLError('Creating new user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },

    login: async (root, args) => {
      if (!args.username || !args.password) {
        throw new GraphQLError('Enter both username and password', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})