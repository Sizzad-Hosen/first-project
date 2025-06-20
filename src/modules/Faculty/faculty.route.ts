import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:id', FacultyControllers.deleteFaculty);

router.get('/',FacultyControllers.getAllFaculties);


export const FacultyRoutes = router;

