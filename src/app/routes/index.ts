import { StudentRoute } from "../../modules/student/student.route";
import { UserRoutes } from "../../modules/user/user.route";
import {Router} from 'express';


const router = Router();

const moduleRoutes = [
    {
        path:'/users',
        route:UserRoutes,
    },
    {
        path:'/users',
        route:StudentRoute,
    }
]

moduleRoutes.forEach((route)=>router.use(route.path, route.route))

router.use('/users', UserRoutes);

router.use('/students', StudentRoute)


export default router;
