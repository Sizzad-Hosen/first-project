
import { Router } from 'express'
import { UserRoutes } from '../../modules/user/user.route'
import { StudentRoutes } from '../../modules/student/student.route'
import { AcademicRoutes } from '../../modules/academicSemester/academicSemester.route'
import { AcademicFacultyRoutes } from '../../modules/academicFaculty/academicFaculty.route'
import { AcademicDepartmentRoutes } from '../../modules/academicDepartment/academicDepartment.route'
import { FacultyRoutes } from '../../modules/Faculty/faculty.route'
import { CourseRoutes } from '../../modules/Course/course.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicRoutes,
  },

  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
]

// Register each route in the `moduleRoutes` array
moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
