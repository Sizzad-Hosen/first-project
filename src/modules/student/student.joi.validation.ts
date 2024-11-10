import Joi from 'joi';

// Define the schema for the 'name' field
const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .regex(/^[A-Z][a-z]*$/) // Ensures the first letter is uppercase
    .messages({
      'string.pattern.base': 'First name must start with an uppercase letter',
      'string.empty': 'First name is required',
    }),

  middleName: Joi.string().trim().optional(),

  lastName: Joi.string()
    .trim()
    .required()
    .regex(/^[A-Za-z]+$/) // Ensures only alphabets in last name
    .messages({
      'string.pattern.base': 'Last name should contain only alphabets',
      'string.empty': 'Last name is required',
    }),
});

// Define the schema for the 'guardian' field
const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'string.empty': 'Father\'s name is required',
  }),
  motherName: Joi.string().required().messages({
    'string.empty': 'Mother\'s name is required',
  }),
  fatherOccupation: Joi.string().required().messages({
    'string.empty': 'Father\'s occupation is required',
  }),
  motherOccupation: Joi.string().required().messages({
    'string.empty': 'Mother\'s occupation is required',
  }),
});

// Define the main schema for the 'student' field
const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'ID is required',
  }),

  name: userNameValidationSchema.required(),

  gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
    'any.only': 'Gender must be Male, Female, or Other',
    'string.empty': 'Gender is required',
  }),

  dateOfBirth: Joi.date().required().messages({
    'date.base': 'Date of Birth must be a valid date',
    'any.required': 'Date of Birth is required',
  }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email is required',
    }),

  contactNo: Joi.string()
    .regex(/^\d{10}$/) // Assumes contact number is 10 digits
    .required()
    .messages({
      'string.pattern.base': 'Contact number must be exactly 10 digits',
      'string.empty': 'Contact number is required',
    }),

  emergencyContactNo: Joi.string()
    .regex(/^\d{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Emergency contact number must be exactly 10 digits',
      'string.empty': 'Emergency contact number is required',
    }),

  bloodGroup: Joi.string().required().messages({
    'string.empty': 'Blood group is required',
  }),

  presentAddress: Joi.string().required().messages({
    'string.empty': 'Present address is required',
  }),

  permanentAddress: Joi.string().required().messages({
    'string.empty': 'Permanent address is required',
  }),

  guardian: guardianValidationSchema.required(),
});

export default studentValidationSchema;
