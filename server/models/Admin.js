import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    department: {
      type: String,
      default: 'Central Admission Directorate'
    },
    designation: {
      type: String,
      default: 'Admission Verification Officer'
    },
    permissions: [
      {
        type: String,
        enum: [
          'verify_documents',
          'allot_seats',
          'request_corrections',
          'reject_applications',
          'view_reports',
          'manage_courses',
          'audit_logs'
        ]
      }
    ],
    assignedBranches: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
