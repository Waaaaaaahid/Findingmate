import { Router } from 'express';
import { submitReport } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, submitReport);

export default router;
