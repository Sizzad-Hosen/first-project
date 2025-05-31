import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import AppError from '../config/errors/AppError';
import multer from 'multer';
import httpStatus from 'http-status';
import { RequestHandler } from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

// ✅ Cloudinary config - Use only once with correct values
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ✅ Send image to Cloudinary

export const sendImageToCloudinary = (
  imageName: string,
  filePath: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { public_id: imageName.trim() },
      (error, result) => {
        // Delete local file
        fs.unlink(filePath, (err) => {
          if (err) console.error('❌ Failed to delete local file:', err);
        });

        if (error) return reject(error);
        resolve(result);
      }
    );
  });
};

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `file-${Date.now()}-${Math.round(Math.random() * 1e9)}`);
  },
});

export const upload = multer({ storage });

// ✅ Middleware to parse multipart/form-data with JSON
export const parseFormDataWithJson: RequestHandler = (req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    upload.single('file')(req, res, () => {
      try {
        if (req.body.data) {
          req.body = {
            ...JSON.parse(req.body.data),
            file: req.file,
          };
        }
        next();
      } catch (err) {
        next(new AppError(httpStatus.BAD_REQUEST, 'Invalid JSON in form-data'));
      }
    });
  } else {
    next();
  }
};
