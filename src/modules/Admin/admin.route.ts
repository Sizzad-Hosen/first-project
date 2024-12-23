import { Router } from "express";
import { AdminController } from "./admin.controller";


const router = Router();


router.post('/create-admin', AdminController.createAdmin)