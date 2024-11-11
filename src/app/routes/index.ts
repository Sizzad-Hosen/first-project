import { AcademicRoutes } from "../../modules/academicSemester/academicSemester.route";
import { StudentRoute } from "../../modules/student/student.route";
import { UserRoutes } from "../../modules/user/user.route";
import { Router } from 'express';

const router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/students',
        route: StudentRoute,
    },
    {
        path: '/academic-semesters',
        route: AcademicRoutes,
    }
];

// Register each route in the `moduleRoutes` array
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
