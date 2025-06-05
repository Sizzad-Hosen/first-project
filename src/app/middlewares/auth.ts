import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../config/errors/AppError';
import config from '../config';
import { User } from '../../modules/user/user.model';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Check Authorization Header
      const authHeader = req.headers.authorization || req.headers.Authorization;
      
      console.log('token',authHeader)
      if (!authHeader) {
        console.error('Missing authorization header entirely');
        throw new AppError(httpStatus.UNAUTHORIZED, 'No authorization header found');
      }

         if (typeof authHeader !== 'string') {
        console.error('Authorization header is not a string');
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid authorization header');
      }

       if (!authHeader.startsWith('Bearer ')) {
        console.error('Malformed authorization header:', authHeader);
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token must start with "Bearer "');
      }
      // if (!authHeader || !authHeader.startsWith('Bearer ')) {
      //   throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided or invalid format!');
      // }

console.log('Raw Authorization header:', JSON.stringify(authHeader));
console.log('Header starts with Bearer?:', authHeader.startsWith('Bearer '));
      // 2. Extract and Verify Token
      
      const token = authHeader.substring(7); // Safer than split(' ')[1]

      
      const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    
      console.log('decoded', decoded)

      // 3. Validate Token Structure
      if (!decoded.userId || !decoded.role || !decoded.iat) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload!');
      }

      const { userId, role, iat } = decoded;

      // 4. Check User Existence & Status
      const user = await User.isUserExistsByCustomId(userId);


      console.log('user',user)


      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
      }

      if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
      }

      if (user.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
      }

      // 5. Check if Token was Issued After Password Change
      if (user.passwordChangedAt && !User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token invalid due to password change!');
      }

      // 6. Role Authorization
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized for this action!');
      }

      // 7. Attach User to Request
      req.user = decoded;
      next();

    } catch (error) {
      // Handle JWT-specific errors
      if (error instanceof jwt.JsonWebTokenError) {
        next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!'));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(new AppError(httpStatus.UNAUTHORIZED, 'Token expired!'));
      } else {
        next(error); // Forward other errors
      }
    }
  };
};

export default auth;