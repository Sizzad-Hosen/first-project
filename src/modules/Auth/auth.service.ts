import config from "../../app/config";
import AppError from "../../app/config/errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import httpStatus from "http-status";
import { createToken, verifyToken } from "./auth.utils";
import bcrypt from 'bcrypt';
import  { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from "../../app/utilis/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  // Checking if the user exists
  const user = await User.isUserExistsByCustomId(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  console.log('User Found:', user.id);

  // Check if deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
  }

  // Check if blocked
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
  }

  // Password Check
  console.log('Entered Password:', payload.password);
  console.log('Saved Hashed Password:', user.password);

  const isPasswordMatched = await User.isPasswordMatched(payload.password, user.password);
  console.log('Password Matched:', isPasswordMatched);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!');
  }

  // Token Payload
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

console.log('jwtpayload',jwtPayload)

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );


  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,

  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // 1. Check if user exists

  console.log('userdata',userData)
  const user = await User.isUserExistsByCustomId(userData.userId);
  console.log('User:', user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // 2. Check if deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // 3. Check if blocked
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // 4. Validate old password
  const isPasswordMatched = await User.isPasswordMatched(payload.oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password does not match!');
  }

  // 5. Hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // 6. Update password fields
  await User.findOneAndUpdate(
    { id: userData.userId },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );

  return { message: 'Password changed successfully' };
};


const refreshToken = async (token: string) => {
  
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  try {
    // ✅ Check if the user exists
    const user = await User.isUserExistsByCustomId(userId);
 console.log('user', user);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    // ✅ Check if the user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
    }

    // ✅ Check if the user is blocked
    if (user.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
    }

    // ✅ Generate JWT for password reset
    const jwtPayload = {
      userId: user.id,
      role: user.role,
    };

    console.log(jwtPayload);


    const resetToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      '10m'
    );

 
    const resetLink = `${config.reset_pass_ui_link}/reset-password?id=${user.id}&token=${resetToken}`;
    
    sendEmail(user?.email, resetLink)
  
    console.log('Reset Password Link:', resetLink);
    return resetLink;
  } catch (error) {
    console.error('Error in forgetPassword:', error);
    throw error;
  }
};

const resetPassword = async(payload:{id:string; newPassword:string},token:string)=>{

  
  const user = await User.isUserExistsByCustomId(payload?.id);
  console.log('user', user);
 
     if (!user) {
       throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
     }
 
     if (user.isDeleted) {
       throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
     }
 
   
     if (user.status === 'blocked') {
       throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
     }
   // checking if the given token is valid
   const decoded = verifyToken(token, config.jwt_access_secret as string);

if (payload.id !== decoded.userId) {
  console.log(payload.id, decoded.userId);
  throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
}

//hash new password
const newHashedPassword = await bcrypt.hash(
  payload.newPassword,
  Number(config.bcrypt_salt_rounds),
);

await User.findOneAndUpdate(
  {
    id: decoded.userId,
    role: decoded.role,
  },
  {
    password: newHashedPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  },
);

}

export const AuthServices = { loginUser,refreshToken ,forgetPassword,changePassword,resetPassword};
