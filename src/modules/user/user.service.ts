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

  console.log('[1] Starting student creation with payload:', { 
    email: payload?.email,
    admissionSemester: payload?.admissionSemester,
    academicDepartment: payload?.academicDepartment,
    hasFile: !!file
  });

  // Validate required fields upfront
  if (!payload?.email) {
    console.error('[2] Email validation failed');
    throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  }

  // Create user data object
  const userData: Partial<TUser> = {
    password: password || config.default_password as string,
    role: "student",
    email: payload.email
  };
  console.log('[3] User data prepared:', userData);

  try {
    // Parallelize database lookups
    console.log('[4] Starting database lookups...');
    
    const [admissionSemester, academicDepartment] = await Promise.all([
      AcademicSemester.findById(payload.admissionSemester),
      AcademicDepartment.findById(payload.academicDepartment)
    ]);
    console.log('[5] Lookup results:', { 
      admissionSemester: !!admissionSemester,
      academicDepartment: !!academicDepartment 
    });

    // Validate references
    if (!admissionSemester) {
      console.error('[6] Admission semester not found');
      throw new AppError(httpStatus.BAD_REQUEST, "Admission semester not found");
    }
    if (!academicDepartment) {
      console.error('[7] Academic department not found');
      throw new AppError(httpStatus.BAD_REQUEST, "Academic department not found");
    }

    // Set derived fields
    payload.academicFaculty = academicDepartment.academicFaculty;
    console.log('[8] Derived academicFaculty:', payload.academicFaculty);

    const session = await mongoose.startSession();
    session.startTransaction();
    console.log('[9] MongoDB transaction started');

    try {
      // Generate student ID
      userData.id = await generateStudentId(admissionSemester);
      console.log('[10] Generated student ID:', userData.id);

      // Handle file upload if present
      if (file) {
        console.log('[11] Starting file upload...');
        const imageName = `${userData.id}${payload?.name?.firstName}`;
        console.log('[12] Generated image name:', imageName);
        
        const { secure_url } = await sendImageToCloudinary(imageName, file.path);
        console.log('[13] Cloudinary response:', secure_url);
        
        payload.profileImg = secure_url;
      }

      // Create user
      console.log('[14] Creating user...');
      const [newUser] = await User.create([userData], { session });
      if (!newUser) {
        console.error('[15] User creation failed');
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
      }
      console.log('[16] User created successfully:', newUser.id);

      payload.id = newUser.id;
      payload.user = newUser._id;

      // Create student
      console.log('[17] Creating student...');
      const [newStudent] = await Student.create([payload], { session });
      if (!newStudent) {
        console.error('[18] Student creation failed');
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
      }
      console.log('[19] Student created successfully:', newStudent.id);

      await session.commitTransaction();
      console.log('[20] Transaction committed successfully');
      
      return newStudent;
    } catch (error) {
      await session.abortTransaction();
      console.error('[21] Transaction aborted due to error:', error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Student creation failed"
      );
    } finally {
      await session.endSession();
      console.log('[22] Session ended');
    }
  } catch (error) {
    console.error('[23] Outer catch block error:', error);
    throw error;
  }
};
const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set faculty role
  userData.role = 'faculty';
  //set faculty email
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  payload.academicFaculty = academicDepartment?.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

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
