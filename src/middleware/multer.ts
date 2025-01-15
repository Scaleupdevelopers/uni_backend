import { S3Client } from "@aws-sdk/client-s3";
import { fileURLToPath } from 'url';
import { dirname } from 'path';


import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import path from "path";
import { Request as ExpressRequest } from "express";

// Load environment variables
dotenv.config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Get the current directory of the file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Local Upload Configuration
const localUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../uploads"); // Local uploads folder
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now().toString()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

// AWS S3 Upload Configuration
const s3Upload = (folder: string) =>
  multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_S3_BUCKET_NAME!,
      key: (req: ExpressRequest, file: Express.Multer.File, cb) => {
        cb(null, `${folder}/${Date.now().toString()}-${file.originalname}`);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req: ExpressRequest, file: Express.Multer.File, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      contentDisposition: "inline",
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only images are allowed"));
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
  });

// Exported Handlers
export const uploadLocalProfileImage = localUpload.single("file");
export const uploadS3ProfileImage = s3Upload("profile_image").single("file");


