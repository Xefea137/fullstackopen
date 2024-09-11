import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import Notification from "./components/Notification";
import SetBirthyear from "./components/SetBirthyear";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  const [showNotification, setShowNotification] = useState({ message: null, type: null })


  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  if (authorsResult.loading) {
    return <div>Loading...</div>
  }

  if (booksResult.loading) {
    return <div>Loading...</div>
  }

  const notify = (message, type) => {
    setShowNotification({ message, type })
    setTimeout(() => {
      setShowNotification({ message: null, type: null })      
    }, 5000);
  }

  return (
    <Router>
      <div>
        <Link style={{ padding: 5 }} to='/'>Authors</Link>
        <Link style={{ padding: 5 }} to='/books'>Books</Link>
        <Link style={{ padding: 5 }} to='/add-books'>Add book</Link>
        <Notification errorMessage={showNotification.message} errorType={showNotification.type} />
      </div>
      <Routes>
        <Route path="/" element={
          <>
            <Authors authors={authorsResult.data.allAuthors} />
            <SetBirthyear authors={authorsResult.data.allAuthors} setNotify={notify}/>
          </>
        } />
        <Route path="/books" element={<Books books={booksResult.data.allBooks} />} />
        <Route path="/add-books" element={<NewBook setNotify={notify} />} />
      </Routes>
    </Router>
  );
};

export default App;
