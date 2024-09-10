import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries"

const SetBirthyear = ({ setNotify }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor, result] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const message = error.graphQLErrors.map(e => e.message)
      setNotify(message, 'red')
    },
    onCompleted: () => {
      setNotify('Birth year set successfully!', 'green')
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

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          Name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
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