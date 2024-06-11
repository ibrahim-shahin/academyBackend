const mongoose = require('mongoose')

const Schema = mongoose.Schema

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  teacher_id: {
    type: String,
    required: true
  },
  teacher_name: {
    type: String,
    required: true
  },
  discreption: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Course', courseSchema)