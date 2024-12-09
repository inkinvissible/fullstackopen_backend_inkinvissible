const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        // Regex pattern: 2-3 digits, hyphen, followed by numbers (total length >= 8)
        return /^(\d{2,3})-(\d+)$/.test(value) && value.length >= 8;
      },

      message: `Error: The phone number is not a valid phone number! Format should be XX-XXXXXX or XXX-XXXXXX (min length 8)`
    }


  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)