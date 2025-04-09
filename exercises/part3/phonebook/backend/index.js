require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

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


app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => res.json(result))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.find({})
    .then(result => {
      const amount = result.length
      const message = `
        <p>Phonebook has info for ${amount} people</p>
        <p>${date}</p>
      `
      res.send(message)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).json({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or phone number is missing' })
  }

  Person.findOne({ name })
    .then(existing => {
      if (existing) {
        return res.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({ name, number })

      return person.save().then(savedPerson => { 
        res.json(savedPerson)
      })
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or phone number is missing' })
  }

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('*', (req, res) => {
  res.sendFile('dist/index.html')
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})