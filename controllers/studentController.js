const Student = require('../models/studentModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Course = require('../models/courseModel')
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" })
}

// login a student
const studentLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill out the missing fields" })
    }

    //find the Student by email
    const student = await Student.findOne({ email })

    if (student) {
      // check if the password is correct
      const match = await bcrypt.compare(password, student.password)

      if (match) {
        // create a token
        const token = createToken(student._id)
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
    res.status(400).json({ error: error.message })
  }
}

// signup a student
const studentSignup = async (req, res) => {
  const { name, email, password } = req.body

  try {
    if (!name || !email || !password) {
      throw Error('Please fill out the missing fields')
    }

    const exists = await Student.findOne({ email })

    if (exists) {
      throw Error('Email already in use')
    }

    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 0, minSymbols: 0 })) {
      throw new Error('Password is not strong enough. It should be at least 8 characters long and contain at least one lowercase letter, and one number.');
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const student = await Student.create({ name, email, password: hash })
    // create a token
    const token = createToken(student._id)

    res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// get all courses
const getCourses = async (req, res) => {
  const student_id = req.student.id
  const student = await Student.findById({ _id: student_id });
  const courses = await Course.find({ _id: { $in: student.courses } });
  res.json(courses)
}

// get a single course
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

// update a Course
const addCourse = async (req, res) => {
  const { id } = req.params
  const student_id = req.student._id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'No such Course' })
  }

  const course = await Student.findById(student_id).updateOne({ $push: { courses: id } })

  if (!course) {
    return res.json({ error: 'No such Course' })
  }

  res.json(course)
}

const deleteCourse = async (req, res) => {
  const { id } = req.params
  const student_id = req.student._id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'No such Course' })
  }

  const course = await Student.findById(student_id).updateOne({ $pull: { courses: id } })

  if (!course) {
    return res.json({ error: 'No such Course' })
  }

  res.json(course)
}

module.exports = { studentSignup, studentLogin, getCourses, getCourse, addCourse, deleteCourse }