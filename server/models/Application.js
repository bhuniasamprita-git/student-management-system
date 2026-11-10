import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applicant',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    // Academic Qualifications
    academics: {
      class10: {
        board: { type: String, default: 'ICSE' },
        school: { type: String },
        passingYear: { type: Number, default: 2022 },
        percentage: { type: Number }
      },
      class12: {
        board: { type: String, default: 'ISC' },
        school: { type: String },
        passingYear: { type: Number, default: 2024 },
        physics: { type: Number },
        chemistry: { type: Number },
        maths: { type: Number },
        pcmPercentage: { type: Number }, // Auto-calculated
        overallPercentage: { type: Number }
      },
      entranceExam: {
        examType: {
          type: String,
          enum: ['WBJEE', 'JEE Main', 'IEMJEE', 'WB-JECA', 'CAT', 'MAT', 'Other'],
          default: 'WBJEE'
        },
        rollNumber: { type: String },
        rank: { type: Number },
        score: { type: String }
      }
    },

    // Course & Branch Preferences
    preferences: [
      {
        order: { type: Number, required: true },
        course: { type: String, required: true }
      }
    ],

    // Reference to uploaded Document collection records
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
      }
    ],

    // Reference to Payment collection record
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },

    // Admission Review Lifecycle Status
    status: {
      type: String,
      enum: [
        'draft',
        'submitted',
        'under_review',
        'verified',
        'correction_required',
        'seat_allotted',
        'rejected',
        'admitted'
      ],
      default: 'draft'
    },
    allottedBranch: {
      type: String,
      default: null
    },
    allottedCategory: {
      type: String,
      default: null
    },
    adminRemarks: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
