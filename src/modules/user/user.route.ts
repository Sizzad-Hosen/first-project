import express, { NextFunction, Request, Response } from 'express'
import { UserControllers } from './user.controller'
import { AnyZodObject } from 'zod'
import createStudentValidationSchema from '../student/student.validation'

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
  '/create-student',
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
)

export const UserRoutes = router
