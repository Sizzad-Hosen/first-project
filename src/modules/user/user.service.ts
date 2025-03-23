import mongoose, { startSession } from "mongoose";
import config from "../../app/config";
import AppError from "../../app/config/errors/AppError";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import AcademicSemester from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { TUser } from "./user.interface";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";
import { User } from "./user.model";
import { Student } from "../student/student.model";
import httpStatus from "http-status";
import { TFaculty } from "../Faculty/faculty.interface";
import { Faculty } from "../Faculty/faculty.model";
import { error } from "console";
import { Admin } from "../Admin/admin.model";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  console.log("Received Payload:", payload); // Debug log

  // Check if payload and email exist
  if (!payload || !payload.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid student payload: email is missing"
    );
  }

  // create a user object
  const userData: Partial<TUser> = {};

  // Set password: use default if not provided
  userData.password = password || (config.default_password as string);

  // Set role and email
  userData.role = "student";
  userData.email = payload.email;

  // Find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester
  );

  if (!admissionSemester) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admission semester not found");
  }

  // // Find academic department
  // const academicDepartment = await AcademicDepartment.findById(
  //   payload.academicDepartment
  // );

  // if (!academicDepartment) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Academic department not found");
  // }

  // // Set faculty info based on department
  // payload.academicFaculty = academicDepartment.academicFaculty;

  // Start transaction
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Generate student ID
     userData.id = await generateStudentId(admissionSemester);

    // === Optionally handle profile image upload ===
    // if (file) {
    //   const imageName = `${userData.id}${payload?.name?.firstName}`;
    //   const path = file?.path;
    //   const { secure_url } = await sendImageToCloudinary(imageName, path);
    //   payload.profileImg = secure_url as string;
    // }

    // Create user (transaction-1)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    // Link student with user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // Create student (transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    // Commit transaction
    await session.commitTransaction();
    await session.endSession();

    console.log("Student & User created successfully");
    return newStudent[0]; // Return student object, not array
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();

    console.error("Error in createStudentIntoDB:", err);

    // Throw detailed error message
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      err.message || "Something went wrong while creating student"
    );
  }
};


const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const createAdminIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); 

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB
};
