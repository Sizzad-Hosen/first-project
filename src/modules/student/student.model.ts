import { Schema, model } from 'mongoose'
import TStudent, {
  TGuardian,

  StudentModel,
  TUsername,
} from './student.interface'

import validator, { isAlpha } from 'validator';

import bcrypt from "bcrypt";
import config from '../../app/config';


const userNameSchema = new Schema<TUsername>({
  firstName: {
    type: String,
    required: true,
    unique:true,
    trim: true,
    validate: {
      validator: function (value) {
        const firstName = value.charAt(0).toUpperCase() + value.slice(1)
        return firstName === value
      },
      message: (props) => `${props.value} must start with an uppercase letter`,
    },
  },
  middleName: {
    type: String,
    required: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: `{VALUE} is not a valid email type`,
    },
  },
})

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
  },
  motherOccupation: {
    type: String,
    required: true,
  },
})

const studentSchema = new Schema<TStudent, StudentModel>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  user:{
    type:Schema.Types.ObjectId,
    required:[true, 'User id is required'],
    unique:true,
    ref:'User',

  },
  // password: {
  //   type: String,
  //   required: true,
  //   maxlength:20
  // },
  name: userNameSchema,

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: `{VALUE} is not a valid email type`,
    },
  },
  contactNo: {
    type: String,
    required: true,
  },
  emergencyContactNo: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  presentAddress: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: true,
  },
  addmissionSemester:{
    type:Schema.Types.ObjectId,
    ref:'AcademicSemester'
  },
  guardian: guardianSchema,
  profileImg:String,
  isDeleted:{
    type:Boolean,
    default:false,
  }
},{
  toJSON:{
    virtuals:true,
  }
});

// pre save middeleware/hook

studentSchema.pre('save',async function(next){

  console.log(this, 'pre hook : we will save data');
 const user = this
//  hasing to the db

 user.password=await bcrypt.hash(user.password,Number(config.bcrpt_salt_rounds))
 
next();


});

studentSchema.post('save', function(doc,next){

  doc.password = '';
  console.log(this, 'hash password');

 next();
});

// query middeleware

studentSchema.pre('find', function(next){
 
  this.find({isDeleted:{$ne:true}})
  next();

})
studentSchema.pre('findOne', function(next){
 
  this.find({isDeleted:{$ne:true}})
  next();

})
// aggregate pipeline

studentSchema.pre('aggregate', function(next){

  this.pipeline().unshift({$match:{isDeleted:{$ne:true}}});

})
// virtual
studentSchema.virtual('fullName').get(function(){
  return `${this.name.firstName} ${this.name.middleName} ${this.name.middleName}`
})
// creating static method
studentSchema.statics.isUserExist = async function(id:string){

  const existingUser = await Student.findOne({id});
  return existingUser;

}
// for creating instance

// studentSchema.methods.isUserExist = async function(id:string){
//   const existingUser = await Student.findOne({id});
//   return existingUser;

// }
export const Student = model<TStudent,StudentModel>('Student', studentSchema)
