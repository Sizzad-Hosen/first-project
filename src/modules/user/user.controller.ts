import httpStatus from 'http-status'

import { UserServices } from './user.service'
import sendResponse from '../../app/utilis/sendResponse'
import catchAsync from '../../app/utilis/catchAsync'
import AppError from '../../app/config/errors/AppError'


const createStudent = catchAsync(async (req, res) => {

  const { password, student: studentData } = req.body;

  console.log('body', req.body,req.file)

  // Validate required fields at controller level
  if (!studentData || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields');
  }

  const result = await UserServices.createStudentIntoDB(
    req.file,
    password,
    studentData
  );

  // Standardized success response
  sendResponse(res, {
    statusCode: httpStatus.CREATED, // 201 for resource creation
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

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



const getMe = catchAsync(async (req, res) => {

  const token = req.headers.authorization;

  if(!token)
  {
    throw new AppError(httpStatus.NOT_FOUND, 'Token not found !')
  }

  const result = await UserServices.getMe(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user i retried succesfully',
    data: result,
  });
});

const changeStatus = catchAsync(async(req,res)=>{
const id = req.params.id;

const result = await UserServices.changeStatus(id,req.body);

sendResponse(res, {
  statusCode: httpStatus.OK,
  success: true,
  message: 'user i retried succesfully',
  data: result,
});

})

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus

}
