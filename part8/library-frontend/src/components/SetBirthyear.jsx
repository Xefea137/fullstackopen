import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries"
import Select from 'react-select'

const SetBirthyear = ({ authors, setNotify }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor, result] = useMutation(UPDATE_AUTHOR, {
    onError: (error) => {
      const message = error.graphQLErrors.map(e => e.message)
      setNotify(message, 'red')
    },
    onCompleted: () => {
      setNotify('Birth year set successfully!', 'green')
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const updatedAuthor = response.data.editAuthor
        return {
          allAuthors: allAuthors.map(a => a.id === updatedAuthor.id ? updatedAuthor : a)
        }
      })
    }
  })

  const submit = (event) => {
    event.preventDefault()
    editAuthor({ variables: {name, setBornTo: +born }})
    setName('')
    setBorn('')
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null){
      setNotify('Author not found', 'red')
    }
  }, [result.data])
  
  const authorOptions = authors.map(a => ({value :a.name, label: a.name}))
  
  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          Name
          <Select options={authorOptions} onChange={({ value }) => setName(value)}></Select>
        </div>
        <div>
          Born
          <input
          type="number"
            value={born}          
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  )
}

export default SetBirthyear