import express, { NextFunction, Request, Response } from 'express'

import { AnyZodObject } from 'zod'

import { AcademicSemesterValidations } from './academicSemester.validation'

const router = express.Router()

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      })
    } catch (error) {
      console.log(error)
    }

    next()
  }
}

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
)

export const AcademicRoutes = router
