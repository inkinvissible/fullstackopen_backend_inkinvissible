require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()


morgan.token('body', (req) => {
    return req.body ? JSON.stringify(req.body) : 'No body'
})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
}






app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const time = new Date()
    Person.find({}).then(persons => {
        const personsLength = persons.length
        response.send(`<h3>Phonebook has info for ${personsLength} people</h3>
                    <h3>${time}</h3>
            `)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ error: 'Invalid ID format' })
    }

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            if (result) {
                response.status(204).end()
            } else {
                response.status(404).json({ error: 'Person not found' })
            }
        })
        .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({ error: 'Number or name are missing' })
    }

    Person.findOne({ name })
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(409).json({
                    error: 'Name must be unique'
                })
            }

            const person = new Person({ name, number })
            return person.save()
        })
        .then(savedPerson => {
            response.status(201).json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { number } = request.body

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ error: 'Invalid ID format' })
    }

    if (!number) {
        return response.status(400).json({ error: 'Phone number is missing' })
    }

    Person.findByIdAndUpdate(
        request.params.id,
        { number },
        { new: true, runValidators: true, context: 'query'}
    )
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(404).json({ error: 'Person not found' })
            }
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler) // Se carga el middleware


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
