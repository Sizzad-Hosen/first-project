import { z } from 'zod'
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  months,
} from './academicSemester.constant'

// Directly create the schema without the body wrapper
const createAcademicSemesterValidationSchema = z.object({
  name: z.enum([...AcademicSemesterName] as [string, ...string[]], {
    required_error: 'Name is required',
  }),
  code: z.enum([...AcademicSemesterCode] as [string, ...string[]], {
    required_error: 'Code is required',
  }),
  year: z.string({
    required_error: 'Year is required',
  }),
  startMonth: z.enum([...months] as [string, ...string[]], {
    required_error: 'Start month is required',
  }),
  endMonth: z.enum([...months] as [string, ...string[]], {
    required_error: 'End month is required',
  }),
})

export const AcademicSemesterValidations = {
  createAcademicSemesterValidationSchema,
}
