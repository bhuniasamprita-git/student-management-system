import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applicant',
      required: true
    },
    documentType: {
      type: String,
      required: true,
      enum: [
        'photo',
        'signature',
        'class10Marksheet',
        'class12Marksheet',
        'rankCard',
        'categoryCertificate'
      ]
    },
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: String
    },
    fileMimeType: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'correction_required'],
      default: 'pending'
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    remarks: {
      type: String,
      default: ''
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
