const Course = require('../models/courseModel')
const mongoose = require('mongoose')

// get all courses
const getCourses = async (req, res) => {
  if (req.teacher || req.student) {
    const courses = await Course.find({})
    console.log(123)
    res.json(courses)
  }
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


// create new Course
const createCourse = async (req, res) => {
  const { name, discreption } = req.body

  // add doc to db
  try {
    const teacher_id = req.teacher._id
    const teacher_name = req.teacher.name
    console.log(teacher_id, teacher_name)
    await Course.create({ name, discreption, teacher_id, teacher_name })
    res.status(200).json("course added")
  } catch (error) {
    if (error.errors.name) {
      res.status(400).json({ error: "Please add a name" })
    }
    else if (error.errors.discreption) {
      res.status(400).json({ error: "Please add a discreption" })
    }
    else {
      res.status(400).json({ error: "Something is wrong" })
    }
  }
}

// delete a Course
const deleteCourse = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'No such Course' })
  }

  const course = await Course.findById({ _id: id }).deleteOne()

  if (!course) {
    return res.json({ error: 'No such Course' })
  }

  res.json(course)
}

// update a Course
const updateCourse = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'No such Course' })
  }

  const updatedFields = { ...req.body }

  if (!updatedFields.name) {
    return res.status(400).json({ error: "Please add a name" })
  }
  else if (!updatedFields.discreption) {
    return res.status(400).json({ error: "Please add a discreption" })
  }

  const course = await Course.findById({ _id: id }).updateOne(updatedFields)

  if (!course) {
    return res.json({ error: 'No such Course' })
  }

  res.json(course)
}


module.exports = {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse
}