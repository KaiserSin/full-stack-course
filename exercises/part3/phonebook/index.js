const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const { request } = require('http');
const app = express();

app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))


app.use((req, res, next) => {
  if (req.method === 'POST') {
    morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next)
  } else {
    next()
  }
})

app.use((req, res, next) => {
  if (req.method !== 'POST') {
    return morgan('tiny')(req, res, next)
  }
  next()
})

let phonebook = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];


app.get("/api/persons", (request, response) =>{
    response.json(phonebook);
})

app.get("/api/persons/:id", (request, response) =>{
    const id = request.params.id
    person = phonebook.find(pers => pers.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.get("/info", (request, response) =>{
    const amount = phonebook.length;
    const date = new Date();

    const message = 
    `
    <p>Phonebook has info for ${amount} people</p>
    <p>${date}</p>
    `
    response.send(message)
})

app.delete("/api/persons/:id", (request, response) =>{
    const id = request.params.id;
    phonebook = phonebook.filter(pers => pers.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) =>{
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or phone number is missing' 
        })
    }

    const nameExists = phonebook.some(person => person.name === body.name)
    if (nameExists) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
    
    let newId
    do {
        newId = Math.floor(Math.random() * 1_000_000)
    } while (phonebook.some(person => person.id === String(newId)))

    const person = {
        id: String(newId),
        name: body.name,
        number: body.number
    }
    phonebook = phonebook.concat(person)
    response.json(person)
})


app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or phone number is missing' 
    })
  }

  const index = phonebook.findIndex(person => person.id === id)
  
  if (index === -1) {
    return response.status(404).json({ error: 'person not found' })
  }

  const updatedPerson = {
    ...phonebook[index],
    name: body.name, 
    number: body.number    
  }

  phonebook[index] = updatedPerson
  response.json(updatedPerson)
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})


const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
