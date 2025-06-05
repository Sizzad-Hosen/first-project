import httpStatus from 'http-status';
import catchAsync from '../../app/utilis/catchAsync';
import { AuthServices } from './auth.service';
import sendResponse from '../../app/utilis/sendResponse';
import config from '../../app/config';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../app/config/errors/AppError';


const loginUser = catchAsync(async (req, res) => {

  console.log('body',req.body)
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  console.log('Authorization Header:', req.headers.authorization); // Check if token exists
  const { oldPassword, newPassword } = req.body;
  
  // Add proper type checking for req.user
  if (!req.user || !req.user.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User authentication failed');
  }

  const user = req.user as JwtPayload;

  console.log('user',user)
  
  const result = await AuthServices.changePassword(user, { 
    oldPassword, 
    newPassword 
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  });
});


const refreshToken = catchAsync(async(req,res)=>{
  const {refreshToken} = req.cookies;


  const result =  await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async(req,res)=>{

  const userId = req.body.id;

  const result = await AuthServices.forgetPassword(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;


  const result = await AuthServices.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

export const AuthControllers = { loginUser,changePassword,refreshToken ,forgetPassword,resetPassword};
