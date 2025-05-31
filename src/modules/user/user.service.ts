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

import { Admin } from "../Admin/admin.model";
import { verifyToken } from "../Auth/auth.utils";
import { sendImageToCloudinary } from "../../app/utilis/sendImageToCloudinary";

const createStudentIntoDB = async (file: any, password: string, payload: TStudent) => {
  // Validate required fields upfront
  if (!payload?.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  }

  // Create user data object
  const userData: Partial<TUser> = {
    password: password || config.default_password as string,
    role: "student",
    email: payload.email
  };

  // Parallelize database lookups
  const [admissionSemester, academicDepartment] = await Promise.all([
    AcademicSemester.findById(payload.admissionSemester),
    AcademicDepartment.findById(payload.academicDepartment)
  ]);

  // Validate references
  if (!admissionSemester) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admission semester not found");
  }
  if (!academicDepartment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Academic department not found");
  }

  // Set derived fields
  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Generate student ID
    userData.id = await generateStudentId(admissionSemester);

    // Handle file upload if present
    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const { secure_url } = await sendImageToCloudinary(imageName, file.path);
      payload.profileImg = secure_url;
    }

    // Create user and student in transaction
    const [newUser] = await User.create([userData], { session });
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    payload.id = newUser.id;
    payload.user = newUser._id;

    const [newStudent] = await Student.create([payload], { session });
    if (!newStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    await session.commitTransaction();
    
    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    
    // Handle specific error types if needed
    if (error instanceof AppError) {
      throw error;
    }
    
    // Log the full error for debugging
    console.error("Student creation failed:", error);
    
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Student creation failed"
    );
  } finally {
    await session.endSession();
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';
  userData.email = payload.email;


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
  userData.email = payload.email;
  
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


const getMe = async(token:string)=>{

  const decode = verifyToken(token,config.jwt_access_secret as string)

  const {userId, role}  = decode;
console.log({userId,role});

let result = null;

if(role=='admin')
{
  result = await Admin.findOne({id:userId})
}

if(role=='student')
{
  result = await Student.findOne({id:userId})
}

if(role=='faculty')
{
  result = await Faculty.findOne({id:userId})
}

return result;


}

const changeStatus = async(id:string, payload:{status:string})=>{


const result = await User.findByIdAndUpdate(id,payload,{
  new:true
})

return result;


}

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe ,
  changeStatus,

};
