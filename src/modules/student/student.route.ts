import express from 'express'
import { StudentController } from './student.controller'

const router = express.Router()

// router.post('/create-student', StudentController.createStudent)

router.get('/', StudentController.getAllStudent)

router.get('/:studentId', StudentController.getIdStudent)

router.delete('/:studentId', StudentController.deleteStudent)

// router.put("/:studentId",StudentController.updatedStudent)

export const StudentRoute = router
