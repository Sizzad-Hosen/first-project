import { httpStatus } from 'http-status';
import mongoose from 'mongoose'
import config from '../../app/config'
import { TAcademicSemester } from '../academicSemester/academicSemester.interface'
import AcademicSemester from '../academicSemester/academicSemester.model'
import TStudent from '../student/student.interface'
import { Student } from '../student/student.model'
import { NewUser, TUser } from './user.interface'

import { User } from './user.model'
import { generateStudentId } from './user.utils'
import AppError from '../../app/config/errors/AppError'

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {}

  userData.password = password || (config.default_password as string)

  //   set student role

  userData.role = 'student'

  //

  const addmissionSemester = await AcademicSemester.findById(
    payload.addmissionSemester,
  )
const session = await mongoose.startSession()



try {
  session.startTransaction();
  //set  generated id
  userData.id = await generateStudentId(addmissionSemester);

  // create a user (transaction-1)
  const newUser = await User.create([userData], { session }); // array

  //create a student
  if (!newUser.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }
  // set id , _id as user
  payload.id = newUser[0].id;
  payload.user = newUser[0]._id; //reference _id

  // create a student (transaction-2)

  const newStudent = await Student.create([payload], { session });

  if (!newStudent.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
  }

  await session.commitTransaction();
  await session.endSession();

  return newStudent;
} catch (err) {
  await session.abortTransaction();
  await session.endSession();
  throw new Error('Failed to create student');
}
}

export const UserServices = {
  createStudentIntoDB,
}
