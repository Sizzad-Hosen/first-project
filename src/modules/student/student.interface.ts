import { Schema, model, connect } from 'mongoose'

export type Guardian = {
  fatherName: string
  motherName: string
  fatherOccupation: string
  motherOccupation: string
}
export type Username = {
  firstName: string
  middleName?: string
  lastName: string
}

interface Student {
  id: string
  name: Username
  gender: 'Male' | 'Female' | 'Other'
  dateOfBirth: Date
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'O+' | 'O-' | 'A+' | 'A-' | 'AB+' | 'AB-' | 'B+' | 'B-'
  presentAddress: string
  permanentAddress: string
  guardian: Guardian
}
export default Student
