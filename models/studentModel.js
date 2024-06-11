const mongoose = require('mongoose')

const Schema = mongoose.Schema

const studentSchema = new Schema({
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
  },
  courses: {
    type: Array
  },
})

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = Student