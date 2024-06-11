const express = require('express')
const requireAuth = require('../middleware/requireAuth')

// controller functions
const { studentLogin, studentSignup, getCourses, getCourse, addCourse, deleteCourse } = require('../controllers/studentController')

const router = express.Router()

// login route
router.post('/login', studentLogin)

// signup route
router.post('/signup', studentSignup)

router.get('/courses', requireAuth, getCourses)

router.get('/course/:id', requireAuth, addCourse)

router.delete('/course/:id', requireAuth, deleteCourse)

module.exports = router