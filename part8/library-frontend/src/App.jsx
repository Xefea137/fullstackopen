import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, ME } from "./queries";
import Notification from "./components/Notification";
import SetBirthyear from "./components/SetBirthyear";
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import UpdateCache from "./components/UpdateCache"

const App = () => {
  const [showNotification, setShowNotification] = useState({ message: null, type: null })
  const [token, setToken] = useState(null)
  const navigate = useNavigate()

  const authorsResult = useQuery(ALL_AUTHORS, { pollInterval: 2000 })
  const booksResult = useQuery(ALL_BOOKS, { pollInterval: 2000 })
  const currentUser = useQuery(ME)

  const client = useApolloClient()  

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log(data)
      const addedBook = data.data.bookAdded
      window.alert(`New book '${addedBook.title}' added`)
      UpdateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  if (authorsResult.loading) {
    return <div>Loading...</div>
  }

  if (booksResult.loading) {
    return <div>Loading...</div>
  }

  if (currentUser.loading) {
    return <div>Loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.clearStore()
    navigate('/login')
  }

  const notify = (message, type) => {
    setShowNotification({ message, type })
    setTimeout(() => {
      setShowNotification({ message: null, type: null })      
    }, 5000);
  }

  return (
    <div>
      <div>
        <Link style={{ padding: 5 }} to='/'>Authors</Link>
        <Link style={{ padding: 5 }} to='/books'>Books</Link>
        {token && <Link style={{ padding: 5 }} to='/add-books'>Add book</Link>}
        {!token && <Link style={{ padding: 5 }} to='/login'>Login</Link>}
        {token && <Link style={{ padding: 5 }} to='/recommend'>Recommend</Link>}
        {token && <button onClick={logout}>Logout</button>}
        <Notification errorMessage={showNotification.message} errorType={showNotification.type} />
      </div>
      <Routes>
        <Route path="/" element={
          <>
            <Authors authors={authorsResult.data.allAuthors} />
            {token && <SetBirthyear authors={authorsResult.data.allAuthors} setNotify={notify}/>}
          </>
        } />
        <Route path="/books" element={<Books books={booksResult.data.allBooks} />} />
        <Route path="/add-books" element={<NewBook setNotify={notify} />} />
        <Route path="/login" element={<LoginForm setToken={setToken} setNotify={notify} refetch={currentUser.refetch} />} />
        <Route path='/recommend' element={
          currentUser.data && currentUser.data.me
          ? <Recommend favoriteGenre={currentUser.data.me.favoriteGenre} />
          : <div>Loading...</div>
        }
        /> 
      </Routes>
    </div>
  );
};

export default App;