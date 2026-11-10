import { 
  Applicant, 
  Application, 
  Document, 
  Payment, 
  Notification, 
  AuditLog 
} from '../models/index.js';

// @desc    Get current applicant's full profile and application details (Enforces user isolation)
// @route   GET /api/application/my-application
// @access  Private (Applicant only)
export const getMyApplication = async (req, res, next) => {
  try {
    // Strictly isolate by logged-in user id
    const applicant = await Applicant.findOne({ userId: req.user.id });
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant profile not found for this user.' });
    }

    const application = await Application.findOne({ applicantId: applicant._id })
      .populate('documents')
      .populate('paymentId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found.' });
    }

    res.status(200).json({
      success: true,
      applicant,
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save personal & academic details as draft / Resume application
// @route   PUT /api/application/save-draft
// @access  Private (Applicant only)
export const saveApplicationDraft = async (req, res, next) => {
  try {
    const { personalInfo, academics, preferences } = req.body;

    const applicant = await Applicant.findOne({ userId: req.user.id });
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant profile not found.' });
    }

    let application = await Application.findOne({ applicantId: applicant._id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Check lock status: cannot edit if locked/under review unless correction is requested
    if (application.status !== 'draft' && application.status !== 'correction_required') {
      return res.status(400).json({
        success: false,
        message: `Application is locked under status "${application.status.toUpperCase()}" and cannot be edited. Contact Admission Office for changes.`
      });
    }

    // 1. Update Applicant Personal Details
    if (personalInfo) {
      if (personalInfo.dob) applicant.dob = personalInfo.dob;
      if (personalInfo.gender) applicant.gender = personalInfo.gender;
      if (personalInfo.category) applicant.category = personalInfo.category;
      if (personalInfo.bloodGroup) applicant.bloodGroup = personalInfo.bloodGroup;
      if (personalInfo.nationality) applicant.nationality = personalInfo.nationality;
      if (personalInfo.guardian) applicant.guardian = { ...applicant.guardian, ...personalInfo.guardian };
      if (personalInfo.address) applicant.address = { ...applicant.address, ...personalInfo.address };
      await applicant.save();
    }

    // 2. Auto-calculate PCM aggregate
    let calculatedPCM = application.academics?.class12?.pcmPercentage;
    if (academics?.class12?.physics !== undefined && academics?.class12?.chemistry !== undefined && academics?.class12?.maths !== undefined) {
      const p = parseFloat(academics.class12.physics || 0);
      const c = parseFloat(academics.class12.chemistry || 0);
      const m = parseFloat(academics.class12.maths || 0);
      calculatedPCM = parseFloat(((p + c + m) / 3).toFixed(1));
    }

    // 3. Update Application Academic Details
    if (academics) {
      application.academics = {
        ...application.academics,
        ...academics,
        class12: {
          ...application.academics?.class12,
          ...academics.class12,
          pcmPercentage: calculatedPCM
        }
      };
    }
    if (preferences && Array.isArray(preferences) && preferences.length > 0) {
      application.preferences = preferences;
    }

    await application.save();

    // 4. Log Action
    await AuditLog.create({
      action: 'APPLICATION_DRAFT_SAVED',
      performedBy: req.user.id,
      performerRole: 'applicant',
      targetApplication: application._id,
      details: { pcmPercentage: calculatedPCM }
    });

    res.status(200).json({
      success: true,
      message: 'Application draft saved successfully. You can resume anytime.',
      applicant,
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Final Application with strict validations
// @route   POST /api/application/submit
// @access  Private (Applicant only)
export const submitApplication = async (req, res, next) => {
  try {
    const applicant = await Applicant.findOne({ userId: req.user.id });
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant profile not found.' });
    }

    const application = await Application.findOne({ applicantId: applicant._id })
      .populate('documents')
      .populate('paymentId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Validation 1: Personal & Guardian details
    if (!applicant.guardian?.name || !applicant.guardian?.phone || !applicant.address?.city) {
      return res.status(400).json({
        success: false,
        message: 'Personal validation failed: Please ensure guardian name, phone, and complete address are filled in.'
      });
    }

    // Validation 2: Academic PCM Validation
    const pcm = application.academics?.class12?.pcmPercentage;
    if (!pcm) {
      return res.status(400).json({
        success: false,
        message: 'Academic validation failed: Class 12th PCM marks (Physics, Chemistry, Maths) must be filled.'
      });
    }

    if (pcm < 45) {
      return res.status(400).json({
        success: false,
        message: `Academic validation failed: Your Class 12 PCM aggregate is ${pcm}%, which is below the minimum AICTE eligibility threshold of 45%.`
      });
    }

    // Validation 3: Document Validation
    const uploadedTypes = application.documents.map(d => d.documentType);
    if (!uploadedTypes.includes('photo') || !uploadedTypes.includes('class12Marksheet')) {
      return res.status(400).json({
        success: false,
        message: 'Document validation failed: Mandatory documents (Passport Photo & Class 12th Marksheet) must be uploaded.'
      });
    }

    // Validation 4: Fee Payment Validation
    if (!application.paymentId || application.paymentId.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Fee payment verification failed: The ₹1,000 application processing fee must be paid before final submission.'
      });
    }

    // Lock and submit
    application.status = 'submitted';
    application.submittedAt = new Date();
    await application.save();

    // Send Notification to Applicant
    await Notification.create({
      recipientId: req.user.id,
      title: 'Application Submitted Successfully',
      message: `Your application (${application.applicationNumber}) has been locked and submitted for scrutiny by the IEM Central Admission Committee.`,
      type: 'status_update',
      actionUrl: '/application-status'
    });

    // Write Audit Log
    await AuditLog.create({
      action: 'APPLICATION_SUBMITTED',
      performedBy: req.user.id,
      performerRole: 'applicant',
      targetApplication: application._id,
      details: { applicationNumber: application.applicationNumber, pcmPercentage: pcm }
    });

    res.status(200).json({
      success: true,
      message: 'Application successfully submitted and locked for verification.',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload Document & Attach to Applicant Dossier
// @route   POST /api/application/upload-document
// @access  Private (Applicant only)
export const uploadDocument = async (req, res, next) => {
  try {
    const { docType } = req.body;
    const file = req.file;

    if (!docType || !file) {
      return res.status(400).json({ success: false, message: 'Please specify document type and select a file.' });
    }

    const applicant = await Applicant.findOne({ userId: req.user.id });
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant profile not found.' });
    }

    const application = await Application.findOne({ applicantId: applicant._id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Check lock status
    if (application.status !== 'draft' && application.status !== 'correction_required') {
      return res.status(400).json({
        success: false,
        message: 'Cannot upload or modify documents while application is under review.'
      });
    }

    const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    // Create or update document record
    let document = await Document.findOne({
      applicationId: application._id,
      documentType: docType
    });

    if (document) {
      document.fileName = file.originalname;
      document.filePath = file.path;
      document.fileSize = fileSizeFormatted;
      document.fileMimeType = file.mimetype;
      document.status = 'pending';
      document.uploadedAt = new Date();
      await document.save();
    } else {
      document = await Document.create({
        applicationId: application._id,
        applicantId: applicant._id,
        documentType: docType,
        fileName: file.originalname,
        filePath: file.path,
        fileSize: fileSizeFormatted,
        fileMimeType: file.mimetype,
        status: 'pending'
      });

      application.documents.push(document._id);
      await application.save();
    }

    await AuditLog.create({
      action: 'DOCUMENT_UPLOADED',
      performedBy: req.user.id,
      performerRole: 'applicant',
      targetApplication: application._id,
      details: { documentType: docType, fileName: file.originalname, size: fileSizeFormatted }
    });

    res.status(200).json({
      success: true,
      message: `Document "${file.originalname}" uploaded and recorded.`,
      document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process Demo Fee Payment & Link to Application
// @route   POST /api/application/process-payment
// @access  Private (Applicant only)
export const processPayment = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;

    const applicant = await Applicant.findOne({ userId: req.user.id });
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant profile not found.' });
    }

    const application = await Application.findOne({ applicantId: applicant._id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const generatedTxn = 'TXN-IEM-' + Math.floor(10000000 + Math.random() * 90000000);

    const payment = await Payment.create({
      applicationId: application._id,
      applicantId: applicant._id,
      userId: req.user.id,
      transactionId: generatedTxn,
      amount: 1000,
      currency: 'INR',
      paymentMethod: paymentMethod || 'UPI',
      paymentGateway: 'IEM Gateway Simulation',
      status: 'completed',
      paidAt: new Date()
    });

    application.paymentId = payment._id;
    await application.save();

    await Notification.create({
      recipientId: req.user.id,
      title: 'Application Fee Paid',
      message: `Application fee of ₹1,000 confirmed for ${application.applicationNumber}. Transaction ID: ${generatedTxn}.`,
      type: 'payment',
      actionUrl: '/payment'
    });

    await AuditLog.create({
      action: 'PAYMENT_COMPLETED',
      performedBy: req.user.id,
      performerRole: 'applicant',
      targetApplication: application._id,
      details: { transactionId: generatedTxn, amount: 1000, method: paymentMethod || 'UPI' }
    });

    res.status(200).json({
      success: true,
      message: 'Fee payment acknowledged and recorded successfully.',
      payment,
      applicationStatus: application.status
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Notifications for Current Applicant
// @route   GET /api/application/notifications
// @access  Private (Applicant only)
export const getApplicantNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipientId: req.user.id },
        { recipientId: null }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    next(error);
  }
};
