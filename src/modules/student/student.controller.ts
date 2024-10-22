import { Request, Response } from 'express'
import { StudentService } from './student.service'

const createStudent = async (req: Request, res: Response) => {
  try {
    console.log('Received request:', req.body)

    const { student: studentData } = req.body

    const result = await StudentService.createStudentIntoDB(studentData)
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error creating student:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the student',
    })
  }
}

const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudentDB()

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error occurred while fetching students:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving students',
    })
  }
}

const getIdStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const result = await StudentService.getIdStudentDB(studentId)

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error occurred while fetching students:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving students',
    })
  }
}

export const StudentController = {
  createStudent,
  getAllStudent,
  getIdStudent,
}
