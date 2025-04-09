require('dotenv').config()
const express = require('express');
const Person = require('./models/person')
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


app.get("/api/persons", (request, response) => {
    Person.find({}).then(result => {
      response.json(result)
    })
})

app.get("/api/persons/:id", (request, response) =>{
    Person.findById(request.params.id).then(person =>{
      response.json(person)
    })
})

app.get("/info", (request, response) =>{
    const date = new Date();

    Person.find({}).then(result => {
      const amount = result.length
      const message = `
          <p>Phonebook has info for ${amount} people</p>
          <p>${date}</p>
      `
      response.send(message)
    })
})

app.delete("/api/persons/:id", (request, response) =>{
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'person not found' })
      }
    })
})

app.post("/api/persons", (request, response) =>{
  const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({ 
            error: 'name or phone number is missing' 
        })
    }

    Person.findOne({ name }).then(existing => {
      if (existing) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
  
      const person = new Person({ name, number })
  
      person.save()
        .then(savedPerson => {
          response.json(savedPerson)
        })
    })
})


app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ 
      error: 'name or phone number is missing' 
    })
  }

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true }
  ).then(updatedPerson => {
    response.json(updatedPerson)
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})


const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
