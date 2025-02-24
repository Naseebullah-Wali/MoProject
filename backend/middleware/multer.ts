import { RequestHandler } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Explicitly cast the type if necessary
const yourHandler = upload.single('file') as RequestHandler;

export default yourHandler;
