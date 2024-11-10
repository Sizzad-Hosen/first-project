import httpStatus from 'http-status';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StudentService } from './student.service';
import sendResponse from '../../app/utilis/sendResponse';
import catchAsync from '../../app/utilis/catchAsync';



const getAllStudent: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await StudentService.getAllStudentDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student retrieved successfully",
    data: result,
  });
});

const getIdStudent: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { studentId } = req.params;
  const result = await StudentService.getIdStudentDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student retrieved successfully",
    data: result,
  });
});

const deleteStudent: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { studentId } = req.params;
  const result = await StudentService.deletedIdStudentDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student deleted successfully",
    data: result,
  });
});

export const StudentController = {
  getAllStudent,
  getIdStudent,
  deleteStudent,
};
