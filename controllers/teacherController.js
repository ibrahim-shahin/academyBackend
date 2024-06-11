const Teacher = require('../models/teacherModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Course = require('../models/courseModel')
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" })
}

// login a teacher
const teacherLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill out the missing fields" })
    }

    //find the teacher by email
    const teacher = await Teacher.findOne({ email })

    if (teacher) {
      // check if the password is correct
      const match = await bcrypt.compare(password, teacher.password)

      if (match) {
        // create a token
        const token = createToken(teacher._id)
        return res.status(200).json({ email, token })
      }
      else {
        return res.status(400).json({ error: "Password is incorrect" })
      }
    }
    else {
      return res.status(400).json({ error: "Email doesn't exist" })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// signup a teacher
const teacherSignup = async (req, res) => {
  const { name, email, password } = req.body

  try {
    if (!name || !email || !password) {
      throw Error('Please fill out the missing fields')
    }

    const exists = await Teacher.findOne({ email })

    if (exists) {
      throw Error('Email already in use')
    }

    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 0, minSymbols: 0 })) {
      throw new Error('Password is not strong enough. It should be at least 8 characters long and contain at least one lowercase letter, and one number.');
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const teacher = await Teacher.create({ name, email, password: hash })
    // create a token
    const token = createToken(teacher._id)

    res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getCourses = async (req, res) => {
  const teacher_id = req.teacher._id

  const courses = await Course.find({ teacher_id })

  console.log(courses)
  return res.json(courses)
}

const getCourse = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'No such course' })
  }

  const course = await Course.findById(id)

  if (!course) {
    return res.json({ error: 'No such course' })
  }

  res.json(course)
}

module.exports = { teacherSignup, teacherLogin, getCourses, getCourse }