import jwt from 'jsonwebtoken';
import { 
  User, 
  Applicant, 
  Application, 
  Admin, 
  Notification, 
  AuditLog 
} from '../models/index.js';
import { generateUniqueAppId } from '../utils/generateAppId.js';

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'iem_kolkata_super_secret_jwt_key_2026_admission',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new applicant, create User, Applicant, Application, and Welcome Notification
// @route   POST /api/auth/register
// @access  Public
export const registerApplicant = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, program } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all mandatory fields.' });
    }

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // 2. Create User record
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: 'applicant',
      isVerified: true
    });

    // 3. Generate guaranteed unique Application ID
    const applicationNumber = await generateUniqueAppId();

    // 4. Create Applicant Profile record (1-to-1 with User)
    const applicant = await Applicant.create({
      userId: user._id,
      applicationNumber,
      guardian: { phone }
    });

    // 5. Create Application record (References Applicant and User)
    const application = await Application.create({
      applicantId: applicant._id,
      userId: user._id,
      applicationNumber,
      preferences: [
        {
          order: 1,
          course: program || 'B.Tech - Computer Science & Engineering'
        }
      ],
      status: 'draft'
    });

    // 6. Send Welcome Notification
    await Notification.create({
      recipientId: user._id,
      title: 'Welcome to IEM Admission Portal 2026-27',
      message: `Dear ${fullName}, your applicant profile has been created with Application ID ${applicationNumber}. Please complete your academic details and document uploads.`,
      type: 'announcement',
      actionUrl: '/application-form'
    });

    // 7. Write Audit Log
    await AuditLog.create({
      action: 'USER_REGISTERED',
      performedBy: user._id,
      performerRole: 'applicant',
      targetApplication: application._id,
      details: { applicationNumber, email, program: program || 'B.Tech CSE' }
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Applicant registered successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        applicationNumber: application.applicationNumber,
        applicantId: applicant._id,
        applicationId: application._id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate User (Applicant or Admin) & Return JWT
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email/Application ID and password.' });
    }

    let user = null;

    // Check if identifier is an Application ID (e.g. IEM-2026-8492)
    if (identifier.toUpperCase().startsWith('IEM-')) {
      const applicant = await Applicant.findOne({ applicationNumber: identifier.toUpperCase() });
      if (applicant) {
        user = await User.findById(applicant.userId).select('+password');
      }
    } else {
      user = await User.findOne({ email: identifier.toLowerCase() }).select('+password');
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // Verify Password with bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check and retry.' });
    }

    const token = generateToken(user._id);

    // Fetch applicant and application details if applicant
    let applicationNumber = null;
    let applicantId = null;
    let applicationId = null;

    if (user.role === 'applicant') {
      const applicant = await Applicant.findOne({ userId: user._id });
      if (applicant) {
        applicantId = applicant._id;
        applicationNumber = applicant.applicationNumber;
        const app = await Application.findOne({ applicantId: applicant._id });
        if (app) applicationId = app._id;
      }
    }

    // Write Audit Log
    await AuditLog.create({
      action: 'USER_LOGGED_IN',
      performedBy: user._id,
      performerRole: user.role,
      targetApplication: applicationId,
      details: { identifier }
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        applicationNumber,
        applicantId,
        applicationId
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Authenticated User & Populated Profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let applicant = null;
    let application = null;
    let adminProfile = null;

    if (user.role === 'applicant') {
      applicant = await Applicant.findOne({ userId: user._id });
      if (applicant) {
        application = await Application.findOne({ applicantId: applicant._id })
          .populate('documents')
          .populate('paymentId');
      }
    } else if (user.role === 'admin') {
      adminProfile = await Admin.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        applicationNumber: applicant ? applicant.applicationNumber : null
      },
      applicant,
      application,
      adminProfile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Dedicated Login
// @route   POST /api/auth/admin-login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin password.' });
    }

    const admin = await Admin.findOne({ userId: user._id });
    const token = generateToken(user._id);

    // Audit Log
    await AuditLog.create({
      action: 'USER_LOGGED_IN',
      performedBy: user._id,
      performerRole: 'admin',
      details: { designation: admin?.designation || 'Admission Officer' }
    });

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        employeeId: admin?.employeeId,
        designation: admin?.designation,
        department: admin?.department
      }
    });
  } catch (error) {
    next(error);
  }
};
