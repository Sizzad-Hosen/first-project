import httpStatus from 'http-status';

import catchAsync from "../../app/utilis/catchAsync";
import sendResponse from "../../app/utilis/sendResponse";
import { FacultyServices } from "./faculty.service";


const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB( id );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is retrieved succesfully',
    data: result,
  });
});


const getAllFaculties = catchAsync(async (req, res) => {
  
  console.log('data faculty',req.query)
  
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);

  if (!result || result.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No faculties found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties retrieved successfully',
    data: result,
    // If paginated, include metadata:
    // meta: {
    //   page: Number(req.query.page) || 1,
    //   limit: Number(req.query.limit) || 10,
    //   total: totalCount,
    // },
  });
});


const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyIntoDB( id , faculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is updated succesfully',
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const {  id } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is deleted succesfully',
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
};