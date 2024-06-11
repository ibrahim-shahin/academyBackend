const jwt = require('jsonwebtoken')
const Student = require('../models/studentModel')
const Teacher = require('../models/teacherModel')

const requireAuth = async (req, res, next) => {
  // verify teacher or student is authenticated
  const { authorization } = req.headers
  console.log("authorization", authorization)

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }
  const token = authorization.split(' ')[1]
  try {
    const { _id } = jwt.verify(token, process.env.SECRET)
    console.log(_id)
    const teacher = await Teacher.findOne({ _id }).select('_id name')
    const student = await Student.findOne({ _id }).select('_id')
    console.log(student)
    if (teacher) {
      console.log(teacher)
      req.teacher = teacher
    }
    else if (student) {
      console.log(student)
      req.student = student
    }
    else
      throw Error('Please log in first')
    next()
  }
  catch (error) {
    console.log(error)
    res.status(401).json({ error: error.message })
  }
}

module.exports = requireAuth