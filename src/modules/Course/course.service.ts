import { httpStatus } from 'http-status';
import mongoose from "mongoose";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCoursefaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import AppError from "../../app/config/errors/AppError";


const createCourseInToDB = async(payload:TCourse)=>{
    const result = await Course.create(payload);
    return result;
    
}
const getAllCourseInToDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(
      Course.find()
       .populate('preRequisiteCourses.course'),
      query,
    )
      .search(CourseSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await courseQuery.modelQuery;
    return result;
  };

const getSingelCourseInToDB = async(id:string)=>{
    const result = await Course.findById(id) .populate('preRequisiteCourses.course')

    return result;
}
const deleteCourseInToDB = async(id:string)=>{
    const result = await Course.findByIdAndUpdate(
        id,
        {isDeleted:true},
        {new:true},

    )

    return result;
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //step1: basic course info update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
    }

    // check if there is any pre requisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }

      // filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );

    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }
};


const assingFacultiesWithCourseIntoDB = async(id:string , payload: Partial<TCoursefaculty>)=>{


  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $addToSet:{faculties:{$each:payload}},

    },
    {
      upsert:true,
      new:true,


    }
  );
  return result;

} 


const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCoursefaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
    createCourseInToDB,
    getAllCourseInToDB,
    getSingelCourseInToDB,
    deleteCourseInToDB,
    updateCourseIntoDB,
    assingFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseFromDB 
}