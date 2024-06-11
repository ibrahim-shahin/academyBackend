require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const courseRoutes = require('./routes/course')
const teacherRoutes = require('./routes/teacher')
const studentRoutes = require('./routes/student')

// express app
const app = express()

// middleware
app.use(express.json())
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/course', courseRoutes)
app.use('/api/teacher', teacherRoutes)
app.use('/api/student', studentRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })