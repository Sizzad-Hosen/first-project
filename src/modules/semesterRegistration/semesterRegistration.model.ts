import mongoose from "mongoose";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { Schema } from "mongoose";
import { SemesterRegisrationStatus } from "./semesterRegistration.constant";



const semesterRegistrationSchema = new mongoose.Schema<TSemesterRegistration>({

    academicSemester:{
        type:Schema.Types.ObjectId,
        unique:true,
        required:true,
        ref:"AcademicSemester"
    },
    status:{
        type:String,
        enum:SemesterRegisrationStatus,
        default:'UPCOMING'
    },
    startDate:{
        type:Date,
        required:true,
    },
    minCredit:{
        type:Number,
        default:3
    },
    maxCredit:{
        type:Number,
        default:15
    }
},{
    timestamps:true
})

export const  SemesterRegistration = mongoose.model<TSemesterRegistration>(
    'SemesterRegistration',
    semesterRegistrationSchema
)