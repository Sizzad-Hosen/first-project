import httpStatus from 'http-status'
import { NextFunction, Request, Response } from 'express'
import sendResponse from '../../app/utilis/sendResponse'
import catchAsync from '../../app/utilis/catchAsync'
import { AcademicSemesterServices } from './academicSemester.service'

const createAcademicSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
      req.body,
    )
    console.log("req body", req.body);
    

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semester is created successfully',
      data: result,
    })
  },
)

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB(
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semesters are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is retrieved successfully',
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is retrieved successfully',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
};