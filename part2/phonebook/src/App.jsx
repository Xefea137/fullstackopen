import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [successMessage, setsuccessMessage] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPhonebook => {
        setPersons(initialPhonebook)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const oldPersonData = persons.find(p => p.name === newName)
        const newPersonData = {...oldPersonData, number: newNumber}
        phonebookService
          .updatePhonenumber(newPersonData)
          .then(returnedPersonData => {
            setPersons(persons.map(person => person.id !== returnedPersonData.id ? person : newPersonData))
            setNewName('')
            setNewNumber('')
            setsuccessMessage(`Updated ${newName}`)
            setTimeout(() => {
              setsuccessMessage(null)
            }, 5000);
          })
      }
      // alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        // id: `${persons.length + 1}`
      }
      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setsuccessMessage(`Added ${newName}`)
          setTimeout(() => {
            setsuccessMessage(null)
          }, 5000);
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const personsToShow = nameSearch === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(nameSearch.toLowerCase()))

  const handleNameSearch = (event) => {
    setNameSearch(event.target.value)
  }

  const handleDeletePerson = (id) => {
    const personToDelete = persons.find(p => p.id === id)
    if (confirm(`Delete ${personToDelete.name} ?`)) {
      phonebookService.deletePerson(id)
      setPersons(persons.filter(person => person.id !== id))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Filter nameSearch={nameSearch} handleNameSearch={handleNameSearch} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      {personsToShow.map(person => <Persons key={person.id} name={person.name} number={person.number} removePerson={() => handleDeletePerson(person.id)} />)}
    </div>
  )
}

export default App