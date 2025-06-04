import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { FacultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import AppError from '../../app/config/errors/AppError';
import { User } from '../user/user.model';


interface IFacultyQuery {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  fields?: string;
  [key: string]: unknown; 
}

const getAllFacultiesFromDB = async (query: IFacultyQuery) => {
  try {
    const facultyQuery = new QueryBuilder(
      Faculty.find().populate('academicDepartment'),
      query,
    )
      .search(FacultySearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await facultyQuery.modelQuery;

    return result;

  } catch (error) {
    throw new Error(`Failed to fetch faculties: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate('academicDepartment');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }
  return result;
};

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found for update');
  }

  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const deletedFaculty = await Faculty.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true, session },
      );

      if (!deletedFaculty) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
      }

      const userId = deletedFaculty.user;

      const deletedUser = await User.findByIdAndUpdate(
        userId,
        { isDeleted: true },
        { new: true, session },
      );

      if (!deletedUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
      }
    });

    return { message: 'Faculty and User deleted successfully' };
  } catch (err: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      err?.message || 'Something went wrong in deletion',
    );
  } finally {
    session.endSession();
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
