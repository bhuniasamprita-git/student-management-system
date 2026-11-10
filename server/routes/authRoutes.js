import express from 'express';
import { 
  registerApplicant, 
  loginUser, 
  getCurrentUser, 
  adminLogin 
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerApplicant);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/me', verifyToken, getCurrentUser);

export default router;
