const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


//from .env file
const url = process.env.MONGODB_URI;
// const url = 


console.log('connecting to', url)

// log a message to the console about the success status
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// The toJSON method
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)