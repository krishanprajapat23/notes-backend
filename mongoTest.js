// this app is only for practice

const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://thecaptain:${password}@cluster0.rq8llnc.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// After establishing the connection to the database, we define the schema for a note and the matching model:
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
// schema ends

/*
// Creating objects

const note = new Note({
    content: 'HTML is easy',
    important: true,
})
*/

/*

// and saving objects
// Saving the object to the database happens with the appropriately named save method, which can be provided with an event handler with the then method:

note.save().then(result => {
    console.log('note saved!', result)
    //   When the object is saved to the database, the event handler provided to then gets called. The event handler closes the database connection with the command mongoose.connection.close(). If the connection is not closed, the program will never finish its execution.
    mongoose.connection.close()
})

*/

// Fetching objects from the database

// comment out the code for generating new notes and replace it with the following
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})

// We could restrict our search to only include important notes like this:

// Note.find({ important: true }).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })


// run your app terminal >> node mongo.js yourPassword