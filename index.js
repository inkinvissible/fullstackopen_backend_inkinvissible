const http = require('http');
const express = require('express');
const { log } = require('console');
const app = express();
app.use(express.json())

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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
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
    console.log(existingPerson);
    
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})