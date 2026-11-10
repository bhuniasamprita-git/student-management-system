import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT Bearer Token
export const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'iem_kolkata_super_secret_jwt_key_2026_admission');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or has expired. Please login again.'
    });
  }
};

// Check if user has Admin role
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Requires Admission Administrator privileges.'
    });
  }
};

// Check if user has Applicant role
export const isApplicant = (req, res, next) => {
  if (req.user && req.user.role === 'applicant') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access restricted to student applicants.'
    });
  }
};
