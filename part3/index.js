require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))

morgan.token('person', (req, res) => { 
  return JSON.stringify(req.body)
})

const morganDisplay = morgan(':method :url :status :res[content-length] - :response-time ms :person')

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)    
  })
})

app.get('/info', (request, response) => {
  const time = new Date()
  Person.find({}).then(person => {
    response.send(`Phonebook has info for ${person.length} people <br/> ${time}`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = Person.find({_id: id}).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
})

const generateID = () => {
  const id = Math.floor(Math.random() * 1000)
  return String(id)
}

app.post('/api/persons', morganDisplay, (request, response) => {
  const body = request.body
  const nameCheck = phonebook.find(person => person.name === body.name)

  if (!body.name) {
    return response.status(400).json({
      error: "Name missing"
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: "Number missing"
    })
  } else if (nameCheck) {
    return response.status(400).json({
      error: "Name must be unique"
    })
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})