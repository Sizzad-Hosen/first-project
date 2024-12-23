import { academicSemsterNameCodeMapper } from './academicSemester.constant'
import {
  TAcademicSemester,
  TAcademicSemesterCode,
  TASemesterNameCodeMapper,
} from './academicSemester.interface'
import AcademicSemester from './academicSemester.model'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemsterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('invalid semster code')
  }
  const result = await AcademicSemester.create(payload)

  return
}

export const AcademicSemsterService = {
  createAcademicSemesterIntoDB,
}
