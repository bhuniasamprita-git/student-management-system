import { 
  Application, 
  Applicant, 
  User, 
  Document, 
  Payment, 
  Notification, 
  AuditLog, 
  Course 
} from '../models/index.js';

// @desc    Get Admission Dashboard Key Metrics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalApplications = await Application.countDocuments();
    const underReview = await Application.countDocuments({ status: { $in: ['submitted', 'under_review'] } });
    const verified = await Application.countDocuments({ status: 'verified' });
    const seatsAllotted = await Application.countDocuments({ status: 'seat_allotted' });
    const correctionRequired = await Application.countDocuments({ status: 'correction_required' });
    const rejected = await Application.countDocuments({ status: 'rejected' });

    // Payment aggregations
    const paidCount = await Payment.countDocuments({ status: 'completed' });
    const totalFeesCollected = paidCount * 1000;

    // Document aggregations
    const totalDocuments = await Document.countDocuments();
    const verifiedDocuments = await Document.countDocuments({ status: 'verified' });

    // Courses and Seats
    const courses = await Course.find();

    // Recent Audit Logs
    const recentLogs = await AuditLog.find()
      .populate('performedBy', 'fullName email role')
      .sort({ timestamp: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        underReview,
        verified,
        seatsAllotted,
        correctionRequired,
        rejected,
        totalFeesCollected,
        paidCount,
        totalDocuments,
        verifiedDocuments
      },
      courses,
      recentLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Applications (with search, status & branch filter, and populate references)
// @route   GET /api/admin/applications
// @access  Private (Admin)
export const getAllApplications = async (req, res, next) => {
  try {
    const { status, branch, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (branch && branch !== 'all') {
      query['preferences.course'] = branch;
    }

    let applications = await Application.find(query)
      .populate('applicantId')
      .populate('userId', 'fullName email phone')
      .populate('documents')
      .populate('paymentId')
      .sort({ createdAt: -1 });

    // Client-side text search if query provided
    if (search) {
      const s = search.toLowerCase();
      applications = applications.filter(app => {
        const name = app.userId?.fullName?.toLowerCase() || '';
        const email = app.userId?.email?.toLowerCase() || '';
        const appNo = app.applicationNumber?.toLowerCase() || '';
        return name.includes(s) || email.includes(s) || appNo.includes(s);
      });
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Application with Full Population (Applicant, User, Documents, Payment)
// @route   GET /api/admin/application/:id
// @access  Private (Admin)
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicantId')
      .populate('userId', 'fullName email phone')
      .populate('documents')
      .populate('paymentId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Fetch related audit logs for this application
    const logs = await AuditLog.find({ targetApplication: application._id })
      .populate('performedBy', 'fullName email role')
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      application,
      logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Application Verification Status & Allot Seat
// @route   PUT /api/admin/application/:id/status
// @access  Private (Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, allottedBranch, allottedCategory, adminRemarks } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('applicantId')
      .populate('userId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const previousStatus = application.status;
    if (status) application.status = status;
    if (adminRemarks !== undefined) application.adminRemarks = adminRemarks;

    if (status === 'seat_allotted') {
      application.allottedBranch = allottedBranch || application.preferences?.[0]?.course;
      application.allottedCategory = allottedCategory || 'General Merit Round 1';
    }

    await application.save();

    // 1. Determine action label for Audit Log
    let actionLabel = 'APPLICATION_VERIFIED';
    if (status === 'seat_allotted') actionLabel = 'SEAT_ALLOTTED';
    else if (status === 'correction_required') actionLabel = 'DOCUMENT_CORRECTION_REQUESTED';
    else if (status === 'rejected') actionLabel = 'APPLICATION_REJECTED';

    await AuditLog.create({
      action: actionLabel,
      performedBy: req.user.id,
      performerRole: 'admin',
      targetApplication: application._id,
      details: {
        previousStatus,
        newStatus: status,
        allottedBranch: application.allottedBranch,
        remarks: adminRemarks
      }
    });

    // 2. Send targeted notification to the applicant
    let notificationTitle = `Admission Status Updated: ${status.toUpperCase()}`;
    let notificationMsg = `Your application (${application.applicationNumber}) has been reviewed by the committee. Status: ${status}. Remarks: ${adminRemarks}`;

    if (status === 'seat_allotted') {
      notificationTitle = '🎉 Congratulations! Provisional Seat Allotted';
      notificationMsg = `You have been provisionally allotted a seat in "${application.allottedBranch}". Please log in to download your official allotment letter.`;
    } else if (status === 'correction_required') {
      notificationTitle = 'Action Required: Document Resubmission';
      notificationMsg = `The admission committee has requested correction on your submitted documents. Remark: ${adminRemarks}`;
    }

    await Notification.create({
      recipientId: application.userId._id,
      title: notificationTitle,
      message: notificationMsg,
      type: 'status_update',
      actionUrl: '/application-status'
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to "${status}". Notification sent to applicant.`,
      application
    });
  } catch (error) {
    next(error);
  }
};
