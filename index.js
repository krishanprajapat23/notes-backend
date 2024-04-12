const express = require('express')
const cors = require('cors')
const app = express()

// activate the json-parser 
app.use(express.json());

// take the middleware to use and allow for requests from all origins:
app.use(cors())

// built-in express middleware [static]
app.use(express.static('dist'))


 // not recommended the maxID method but replace soon
const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
}

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

//   root 
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })


//   all collection get
  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })

//   for individual id get
  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => {
        // console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
      })
    // console.log(note)
    if (note) {
        response.json(note)
      } else {
        // response.status(404).end()
        response.statusMessage = "Page Not Found.";
        response.status(404).end();
      }
  })

//   post request
  app.post('/api/notes', (request, response) => {
    // const note = request.body
    // console.log(note)
    // response.json(note)

   
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)

  })


  // for update
  app.put('/api/notes/:id', (request, response) => {
    const body = request.body
    const id = Number(request.params.id);
    const updatedNote = notes.find(note => note.id === id);
    if (updatedNote) {
        updatedNote.content = body.content;
        updatedNote.important = body.important;
        response.json(updatedNote);
    } else {
        response.status(404).json({ error: 'Note not found' });
    }
  });

//   for delete
  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })






  // middleware
  
  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)