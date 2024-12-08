const http = require('http');
const express = require('express')
const morgan = require('morgan')
const { log } = require('console')
const cors = require('cors')
const app = express()

morgan.token('body', (req) => {
    return req.body ? JSON.stringify(req.body) : 'No body';
});


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let phonebook = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const currentTime = new Date();
    const lengthPhoneBook = phonebook.length
    response.send(`
        <h1>Phonebook has info for ${lengthPhoneBook} people</h1>
        <h3> Request done at: ${currentTime}</h3>
        `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)
    person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => maxId = Math.floor(Math.random() * 99999999999)

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: "Content missing... " })
    }

    const existingPerson = phonebook.some(person => person.name === body.name)

    if (!existingPerson) {
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
        phonebook = phonebook.concat(person)
        response.json(person)
    } else {
        response.status(409).json({ error: "name must be unique" })
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
