import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../app/utilis/sendResponse';
import catchAsync from '../../app/utilis/catchAsync';

const createStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { password, student: studentData } = req.body;
  console.log("user", studentData);

  // Pass validated student data to service layer for creating user in the database
  const result = await UserServices.createStudentIntoDB(studentData, password);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
