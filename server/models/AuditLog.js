import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'USER_REGISTERED',
        'USER_LOGGED_IN',
        'APPLICATION_DRAFT_SAVED',
        'APPLICATION_SUBMITTED',
        'DOCUMENT_UPLOADED',
        'DOCUMENT_VERIFIED',
        'DOCUMENT_CORRECTION_REQUESTED',
        'PAYMENT_COMPLETED',
        'APPLICATION_VERIFIED',
        'SEAT_ALLOTTED',
        'APPLICATION_REJECTED'
      ]
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    performerRole: {
      type: String,
      enum: ['applicant', 'admin', 'system'],
      default: 'applicant'
    },
    targetApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    },
    userAgent: {
      type: String,
      default: 'IEM Portal Client'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
