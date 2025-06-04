import  httpStatus  from 'http-status';
import catchAsync from "../../app/utilis/catchAsync";
import sendResponse from "../../app/utilis/sendResponse";
import { CourseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseInToDB(req.body);

  console.log("result", result);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course is created succesfully',
      data: result,
    });
  });
  
  const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCourseInToDB(req.query);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course are retrieved successfully',
      data: result,
    });
  });
  

  const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getSingelCourseInToDB(id);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course is retrieved succesfully',
      data: result,
    });
  });
  
  const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseIntoDB(id, req.body);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'course is updated succesfully',
      data: result,
    });
  });
  
  const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourseInToDB(id);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course is deleted succesfully',
      data: result,
    });
  });

  const getFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await CourseServices.getFacultiesWithCourseFromDB(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties retrieved successfully',
    data: result,
  });
});

  
  const assignFacultiesWithCourse = catchAsync(async (req, res) => {

    const { courseId } = req.params;
    const {faculties} = req.body;
    console.log('data',req.params, req.body)

    const result = await CourseServices.assignFacultiesWithCourseIntoDB(courseId,faculties);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'assing course updated succesfully',
      data: result,
    });
  });
  
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;

  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties removed  succesfully',
    data: result,
  });
});


  export const CourseControllers = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    deleteCourse,
    updateCourse,
    assignFacultiesWithCourse,
    removeFacultiesFromCourse,
    getFacultiesWithCourse

  }