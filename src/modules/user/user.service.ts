import config from "../../app/config";
import TStudent from "../student/student.interface";
import { Student } from "../student/student.model";
import { NewUser, TUser } from "./user.interface";

import { User } from "./user.model";

const createStudentIntoDB = async (password:string, studentData: TStudent) => {

const userData: Partial<TUser> = {}

userData.password = password || (config.default_password as string)
 

//   set student role

   userData.role = 'student';

//   
   userData.id = '2564632680'

// create a user
    const newUser= await User.create(userData)

    // create a student 
    if(Object.keys(newUser).length){

        // set id , _id as userData
        studentData.id = newUser.id;
        studentData.user = newUser._id;
    
const newStudent = await Student.create(studentData);
return newStudent;
    }
    
  

  }
  

  export const UserServices = {
    createStudentIntoDB

  }