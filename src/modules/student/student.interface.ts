
import { Schema,Types, model, connect, Model } from 'mongoose'

export type TGuardian = {
  fatherName: string
  motherName: string
  fatherOccupation: string
  motherOccupation: string
}
export type TUsername = {
  firstName: string
  middleName?: string
  lastName: string
}

interface TStudent {
  
  id: string,
  user:Types.ObjectId,
  password:string
  name: TUsername
  gender: 'Male' | 'Female' | 'Other'
  dateOfBirth: Date
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'O+' | 'O-' | 'A+' | 'A-' | 'AB+' | 'AB-' | 'B+' | 'B-'
  presentAddress: string
  permanentAddress: string
  profileImg:string
  guardian: TGuardian
  isDeleted:boolean
}
export default TStudent

// for creating static

export interface StudentModel extends Model<TStudent> {
  isUserExist(id: string): Promise<TStudent | null>
}
// for creating instance

// export type StudentMethods = {
//   isUserExist(id: string): Promise<TStudent | null>
// }



// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >
