import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import Notification from "./components/Notification";
import SetBirthyear from "./components/SetBirthyear";

const App = () => {
  const [page, setPage] = useState("authors");
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
    }, 2000);
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>Authors</button>
        <button onClick={() => setPage("books")}>Books</button>
        <button onClick={() => setPage("add")}>Add book</button>
      </div>

      <Notification errorMessage={showNotification.message} errorType={showNotification.type} />

      {page === 'authors' && (
        <div>
          <Authors authors={authorsResult.data.allAuthors} />
          <SetBirthyear setNotify={notify}/>
        </div>
        )}
      {page === 'books' && <Books books={booksResult.data.allBooks} />}
      {page === 'add' && <NewBook setNotify={notify}/>}
    </div>
  );
};

export default App;
