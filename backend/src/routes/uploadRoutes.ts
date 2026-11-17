import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, upload.single('image'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded or invalid file format.' });
    return;
  }

  // Construct URL
  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
  });
});

export default router;
