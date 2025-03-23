import httpStatus from 'http-status'
import { NextFunction, Request, Response } from 'express'
import { UserServices } from './user.service'
import sendResponse from '../../app/utilis/sendResponse'
import catchAsync from '../../app/utilis/catchAsync'

const createStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, student: studentData } = req.body
    console.log('Received student data:', studentData)

    // 🚩 FIXED: Correct argument order
    const result = await UserServices.createStudentIntoDB(password, studentData)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student created successfully',
      data: result,
    })
  },
)
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created succesfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});


export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
}
