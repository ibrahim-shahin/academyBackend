const mongoose = require('mongoose')

const Schema = mongoose.Schema

const teacherSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    required: true
  }  
})

module.exports = mongoose.model('Teacher', teacherSchema)