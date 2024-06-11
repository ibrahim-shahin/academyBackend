const express = require('express')
const requireAuth = require('../middleware/requireAuth')

// controller functions
const { teacherLogin, teacherSignup, getCourses, getCourse } = require('../controllers/teacherController')

const router = express.Router()

// login route
router.post('/login', teacherLogin)

// signup route
router.post('/signup', teacherSignup)

router.get('/courses', requireAuth, getCourses)

router.get('/courses/:id', requireAuth, getCourse)

module.exports = router