import { z } from 'zod'

// Enums for predefined values
enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

const BloodGroup = z.enum(['O+', 'O-', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-'])

// Username Schema with validation
const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .regex(/^[A-Z][a-z]*$/, {
      message: 'First name must start with an uppercase letter',
    }),

  middleName: z.string().trim().optional(),

  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .regex(/^[A-Za-z]+$/, {
      message: 'Last name should contain only alphabets',
    }),
})

// Guardian Schema
const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, { message: "Father's name is required" }),
  motherName: z.string().min(1, { message: "Mother's name is required" }),
  fatherOccupation: z
    .string()
    .min(1, { message: "Father's occupation is required" }),
  motherOccupation: z
    .string()
    .min(1, { message: "Mother's occupation is required" }),
})

// Main Student Schema
const createStudentValidationSchema = z.object({
  // id: z.string().min(1, { message: 'ID is required' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(20, { message: 'Password must be 20 characters or less' }),

  student: z.object({
    name: userNameValidationSchema,

    gender: z.nativeEnum(Gender, { required_error: 'Gender is required' }),

    dateOfBirth: z
      .union([z.string(), z.date()])
      .transform((value) => {
        const date = typeof value === 'string' ? new Date(value) : value
        return isNaN(date.getTime()) ? undefined : date
      })
      .refine((date) => date !== undefined, { message: 'Invalid date format' }),

    email: z.string().email({ message: 'Email must be a valid email address' }),

    contactNo: z
      .string()
      .regex(/^\d{10}$/, {
        message: 'Contact number must be exactly 10 digits',
      }),

    emergencyContactNo: z
      .string()
      .regex(/^\d{10}$/, {
        message: 'Emergency contact number must be exactly 10 digits',
      }),

    bloodGroup: BloodGroup,

    presentAddress: z
      .string()
      .min(1, { message: 'Present address is required' }),

    permanentAddress: z
      .string()
      .min(1, { message: 'Permanent address is required' }),
    profileImg: z.string(),
    addmissionSemester:z.string(),
    guardian: guardianValidationSchema,
    isDeleted: z.boolean().default(false),
  }),
})

// Exporting the schema
export default createStudentValidationSchema

export type Student = z.infer<typeof createStudentValidationSchema>
