import TStudent from './student.interface'
import { Student } from './student.model'

// const createStudentIntoDB = async (studentData: TStudent) => {


  
//   if( await Student.isUserExist(studentData.id))

//     {
//       throw new Error("user already exist!!");
//     }

//   const result = await Student.create(studentData)
//   return result;

//   // const student = new Student(studentData);
//   // if(await student.isUserExist(studentData.id))
//   // {
//   //   throw new Error("user already exist!!");

//   // }
 
//   // const result = await student.save(); //built in method
//   // return result;

// }

const getAllStudentDB = async (student: TStudent) => {
  const result = await Student.find()
  return result
}


const getIdStudentDB = async (id: string) => {
  const result = await Student.findOne({ id })
  return result
}


const deletedIdStudentDB = async (id: string) => {
  const result = await Student.updateOne({ id },{isDeleted:true})
  return result
}

// const updatedIdStudentDB =  async (id:string, updatedData: TStudent) => {

//   const result = await Student.findByIdAndUpdate(id, updatedData);
//   console.log("result", result);
  

//   return result;
// }

export const StudentService = {

  getAllStudentDB,
  getIdStudentDB,
  deletedIdStudentDB,
  // updatedIdStudentDB

}
