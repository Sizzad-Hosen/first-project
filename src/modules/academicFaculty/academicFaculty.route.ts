import express from 'express'
import { AcademicFacultyValidation } from './academicFaculty.validation'
import { AcademicFacultyControllers } from './academicFaculty.controller'
import validateRequest from '../../app/middlewares/validateRequest'
import auth from '../../app/middlewares/auth'

const router = express.Router()

router.post(
  '/create-academic-faculty',

  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
)

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty)

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
)

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties)

export const AcademicFacultyRoutes = router
