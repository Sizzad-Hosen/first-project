import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../config/errors/AppError';
import config from '../config';
import { User } from '../../modules/user/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    try {

      const authHeader = req.headers.authorization;
      console.log('Authorization Header:', authHeader);

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided or wrong format!');
      }

      const token = authHeader.split(' ')[1]; // Extract token

      const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

      console.log('Decoded Token:', decoded);

      const { role, userId, iat } = decoded;

      const user = await User.isUserExistsByCustomId(userId);
      
      if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

      if (user.isDeleted) throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
      if (user.status === 'blocked') throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');

      if (user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token invalid due to password change!');
      }

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Role not authorized!');
      }

      req.user = decoded;
      next();

    } catch (error) {
      next(error);
    }
  };
};

export default auth;
