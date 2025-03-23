import { model, Schema } from "mongoose";
import { FacultyModel, TBloodGroup, TFaculty, TGender, TUserName } from "./faculty.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
});

const facultySchema = new Schema<TFaculty, FacultyModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'] as TGender[],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloogGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as TBloodGroup[],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImg: { type: String },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic Department is required'],
      ref: 'AcademicDepartment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// Virtual for full name
facultySchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName || ''} ${this.name.lastName}`.trim();
});

// Filter out deleted
facultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
facultySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
facultySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Static method
facultySchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Faculty.findOne({ id });
  return existingUser; // returns null or the object
};

export const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema);
