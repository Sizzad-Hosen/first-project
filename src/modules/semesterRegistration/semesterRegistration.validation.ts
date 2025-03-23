import z from "zod";
import { SemesterRegisrationStatus } from "./semesterRegistration.constant";


const createSemsterRegistrationValidationSchema = z.object({
    body:z.object({
    academicSemester :z.string(),
    status: z.enum([...SemesterRegisrationStatus as [string,...string[]]]),
    startDate:z.string().datetime(),
    endDate:z.string().datetime(),
    minCredit:z.number(),
    maxCredit:z.number()
    
    })
})
const upadateSemesterRegistrationValidationSchema = z.object({
    body: z.object({
      academicSemester: z.string().optional(),
      status: z
        .enum([...(SemesterRegisrationStatus as [string, ...string[]])])
        .optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      minCredit: z.number().optional(),
      maxCredit: z.number().optional(),
    }),
  });
  

export const SemesterRegistrationValidations = {
    createSemsterRegistrationValidationSchema,
    upadateSemesterRegistrationValidationSchema,
}