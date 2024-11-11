import mongoose, { Schema, Document, model } from 'mongoose'
import {
  TAcademicSemesterName,
  TAcademicSemesterCode,
  TMonths,
  TAcademicSemester,
} from './academicSemester.interface'

const months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const academicSemesterNames: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
] as const
const academicSemesterCodes: TAcademicSemesterCode[] = [
  '01',
  '02',
  '03',
] as const

export interface AcademicSemester extends Document {
  name: TAcademicSemesterName
  code: TAcademicSemesterCode
  year: string
  startMonth: TMonths
  endMonth: TMonths
}

const AcademicSemesterSchema: Schema = new Schema<AcademicSemester>({
  name: {
    type: String,
    enum: academicSemesterNames,
    required: true,
  },
  code: {
    type: String,
    enum: academicSemesterCodes,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  startMonth: {
    type: String,
    enum: months,
    required: true,
  },
  endMonth: {
    type: String,
    enum: months,
    required: true,
  },
})

// middelware

AcademicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  })

  if (isSemesterExists) {
    throw new Error(' semster is already exists !')
  }
  next()
})
const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  AcademicSemesterSchema,
)

export default AcademicSemester
