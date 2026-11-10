import express from 'express';
import { 
  getDashboardStats, 
  getAllApplications, 
  getApplicationById, 
  updateApplicationStatus 
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply admin protection to all admin routes
router.use(verifyToken, isAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/applications', getAllApplications);
router.get('/application/:id', getApplicationById);
router.put('/application/:id/status', updateApplicationStatus);

export default router;
