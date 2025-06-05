import express from 'express';
import { OfferedCourseControllers } from './OfferedCourse.controller';
import { OfferedCourseValidations } from './OfferedCourse.validation';
import validateRequest from '../../app/middlewares/validateRequest';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/',OfferedCourseControllers.getAllOfferedCourses);

router.get('/my-offered-courses',
     auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
  ),
  OfferedCourseControllers.getMyOfferedCourses);

router.get('/:id',OfferedCourseControllers.getSingleOfferedCourses);

router.post('/create-offered-course',validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),OfferedCourseControllers.createOfferedCourse,
);

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  OfferedCourseControllers.deleteOfferedCourseFromDB,
);

export const offeredCourseRoutes = router;