const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Note = require('../models/note')
const User = require('../models/user')


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}



// notesRouter.get('/', (request, response) => {
//   Note.find({}).then(notes => {
//     response.json(notes)
//   })
// })

// with async/await
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

// notesRouter.get('/:id', (request, response, next) => {
//   Note.findById(request.params.id)
//     .then(note => {
//       if (note) {
//         response.json(note)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })

// with async/await
// notesRouter.get('/:id', async (request, response, next) => {
//   try {
//     const note = await Note.findById(request.params.id)
//     if (note) {
//       response.json(note)
//     } else {
//       response.status(404).end()
//     }
//   } catch(exception) {
//     next(exception)
//   }
// })

// with express-async-errors lib==============================================================================
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// notesRouter.post('/', (request, response, next) => {
//   const body = request.body

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   })

//   note.save()
//     .then(savedNote => {
//       // response.json(savedNote)
//       // the status code 201 CREATED:
//       response.status(201).json(savedNote)
//     })
//     .catch(error => next(error))
// })

// with async/await
// notesRouter.post('/', async (request, response, next) => {
//   const body = request.body

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   })

//   try {
//     const savedNote = await note.save()
//     response.status(201).json(savedNote)
//   } catch(exception) {
//     next(exception)
//   }
// })

// with express-async-errors lib==============================================================================
notesRouter.post('/', async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // const user = await User.findById(body.userId) //== without login
  const user = await User.findById(decodedToken.id)


  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  })

  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

// notesRouter.delete('/:id', (request, response, next) => {
//   Note.findByIdAndDelete(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

// with async/await
// notesRouter.delete('/:id', async (request, response, next) => {
//   try {
//     await Note.findByIdAndDelete(request.params.id)
//     response.status(204).end()
//   } catch(exception) {
//     next(exception)
//   }
// })

// with express-async-errors lib==============================================================================
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// notesRouter.put('/:id', (request, response, next) => {
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }

//   Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     .then(updatedNote => {
//       response.json(updatedNote)
//     })
//     .catch(error => next(error))
// })

// with async/await
// notesRouter.put('/:id', async (request, response) => {
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }
//   try{
//     const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     response.json(updatedNote)
//   } catch(exception) {
//         next(exception)
//   }
// })

// with express-async-errors lib==============================================================================

notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote)
})


module.exports = notesRouter