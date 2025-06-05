
import AppError from '../../app/config/errors/AppError';
import catchAsync from '../../app/utilis/catchAsync';
import sendResponse from '../../app/utilis/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';
import httpStatus from 'http-status';

const createEnrolledCourse = catchAsync(async (req, res) => {
    console.log('Request Body:', req.body);
  
    const userId = req.body?.userId;
    if (!userId) {
      throw new AppError(httpStatus.BAD_REQUEST, "userId is missing in request body!");
    }
  
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
      userId,
      req.body,
    );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is enrolled successfully',
      data: result,
    });
  });
  
  

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {

  const facultyId = req.user.userId;
  console.log('user', facultyId);

  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    facultyId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Marks is updated succesfully',
    data: result,
  });
});

const getAllEnrolledCourses = catchAsync(async (req, res) => {
  
  const facultyId = req.user.userId;

  const result = await EnrolledCourseServices.getAllEnrolledCoursesFromDB(
    facultyId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled courses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req.user.userId;

  const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
    studentId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled courses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});



export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getAllEnrolledCourses,
  getMyEnrolledCourses
};

