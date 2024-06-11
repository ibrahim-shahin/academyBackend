const express = require('express')
const {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse
} = require('../controllers/courseController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getCourses)

//GET a single workout
router.get('/:id', getCourse)

// POST a new workout
router.post('/', createCourse)

// DELETE a workout
router.delete('/:id', deleteCourse)

// UPDATE a workout
router.patch('/:id', updateCourse)


module.exports = router