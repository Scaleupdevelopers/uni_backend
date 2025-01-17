// src/types/express/index.d.ts

declare namespace Express {
    export interface Request {
      user?: any; // Add the 'user' property with any type or define a proper type for the user data
    }
  }

  declare namespace Express {
    export interface MulterS3File extends Multer.File {
      location: string; // Add the location property for S3
      key: string; // Optional: Add key if needed
    }
  }
  
  