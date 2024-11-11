import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../app/utilis/sendResponse';
import catchAsync from '../../app/utilis/catchAsync';
import { AcademicSemsterService } from './academicSemester.service';



const createAcademicSemester = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
  const result = await AcademicSemsterService.createAcademicSemesterIntoDB(req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic semester is created successfully",
    data: result,
  });
});

export const AcademicControllers = {
  createAcademicSemester,
};
