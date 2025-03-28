import httpStatus from 'http-status';
import mongoose from 'mongoose';

import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../app/config/errors/AppError';
import { query } from 'express';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';



const getAllStudentsFromDB = async (query: Record<string, unknown>) => {


  const studentQuery = new QueryBuilder(Student.find()
  .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      })
  , query)
  .search(studentSearchableFields)
  .filter()
  .sort()
  .paginate()
  .fields()
console.log(studentQuery)

  const result = await studentQuery.modelQuery;
  return result;


//   console.log('query result', query);
//   const queryObj = {...query};

//   // searching 
//   let searchTerm = '';

//   if (query?.searchTerm) {
//     searchTerm = query.searchTerm as string;
//   }
//   const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];


//   const searchQuery = Student.find({
//     $or: studentSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: 'i' },
//    })),
//   });


//   // filtering 
//   const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
//   excludeFields.forEach((el)=>delete queryObj[el]);

//   console.log(queryObj)

//   const filterQuery = searchQuery
//     .find(queryObj)
//     .populate('admissionSemester')
//     .populate({
//       path: 'academicDepartment',
//       populate: {
//         path: 'academicFaculty',
//       },
//     });

//     // sorting

//     let sort = '-createdAt';

//     if (query.sort) {
//       sort = query.sort as string;
//     }
  
//      const sortQuery = filterQuery.sort(sort);
  
//   let limit = 1;
//   let page = 1;
//   let skip = 0

//   if(query.limit)
//   {
//     limit = Number(query.limit)
//   }


//   if(query.page)
//   {
//     page = Number(query.page)
//     skip = (page-1)*limit;
//   }

//   const paginateQuery = sortQuery.skip(skip);

//   const limitQuery = paginateQuery.limit(limit);

//   // field limiting

// // it help to us exjust quert to sent fronend and it help us to cut any query field
  
//   // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH 

//   // fields: 'name,email'; // WE ARE ACCEPTING FROM REQUEST
//   // fields: 'name email'; // HOW IT SHOULD BE 


//   let fields = '- __v' ;

//   if(query.fields)
//   {
//     fields = (query.fields as string).split('').join('')
//   }
//   const fieldsQuery = await limitQuery.select(fields);


//   return fieldsQuery
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
    guardain: {
      fatherOccupation:"Teacher"
    }

    guardian.fatherOccupation = Teacher

    name.firstName = 'Mezba'
    name.lastName = 'Abedin'
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};



const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
