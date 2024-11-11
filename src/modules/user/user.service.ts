import config from "../../app/config";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import AcademicSemester from "../academicSemester/academicSemester.model";
import TStudent from "../student/student.interface";
import { Student } from "../student/student.model";
import { NewUser, TUser } from "./user.interface";

import { User } from "./user.model";
import { generateStudentId } from "./user.utils";

const createStudentIntoDB = async (password:string, payload: TStudent) => {

const userData: Partial<TUser> = {}

userData.password = password || (config.default_password as string)
 

//   set student role

   userData.role = 'student';

//   


const addmissionSemester = await AcademicSemester.findById(payload.addmissionSemester)


   userData.id = generateStudentId(addmissionSemester);
   


// create a user
    const newUser= await User.create(userData)

    // create a student 
    if(Object.keys(newUser).length){

        // set id , _id as userData
        payload.id = newUser.id;
        payload.user = newUser._id;
    
const newStudent = await Student.create(payload);
return newStudent;
    }
    
  

  }
  

  export const UserServices = {
    createStudentIntoDB

  }