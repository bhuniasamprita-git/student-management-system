import express from 'express';
import { 
  getMyApplication, 
  saveApplicationDraft, 
  submitApplication, 
  uploadDocument, 
  processPayment,
  getApplicantNotifications 
} from '../controllers/applicationController.js';
import { verifyToken, isApplicant } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply applicant protection to all application routes (Strict isolation)
router.use(verifyToken, isApplicant);

router.get('/my-application', getMyApplication);
router.put('/save-draft', saveApplicationDraft);
router.post('/submit', submitApplication);
router.post('/upload-document', upload.single('document'), uploadDocument);
router.post('/process-payment', processPayment);
router.get('/notifications', getApplicantNotifications);

export default router;
