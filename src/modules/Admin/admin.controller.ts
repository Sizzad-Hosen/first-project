import { httpStatus } from 'http-status';
import catchAsync from "../../app/utilis/catchAsync"
import sendResponse from "../../app/utilis/sendResponse"
import { AdminService } from "./admin.service"


const createAdmin = catchAsync(async(req,res)=>{
    const result = await AdminService.createAdminfromDB(req.body)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin is created succesfully',
        data: result,
      })
})


export const AdminController = {
    createAdmin,
}