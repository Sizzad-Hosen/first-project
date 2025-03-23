import express, { NextFunction, Request, Response } from 'express'

import { AcademicSemesterValidations } from './academicSemester.validation'
import { AcademicSemesterControllers } from './academicSemester.controller'
import validateRequest from '../../app/middlewares/validateRequest'

const router = express.Router()



router.post(
  '/create-academic-semester',AcademicSemesterControllers.createAcademicSemester
)

router.get('/:semesterId',AcademicSemesterControllers.getSingleAcademicSemester);

router.patch('/:semesterId',validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);

router.get('/',AcademicSemesterControllers.getAllAcademicSemesters);

export const AcademicRoutes = router
