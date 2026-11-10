import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    dob: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    category: {
      type: String,
      enum: ['General', 'SC', 'ST', 'OBC-A', 'OBC-B', 'EWS'],
      default: 'General'
    },
    bloodGroup: {
      type: String,
      default: 'O+'
    },
    nationality: {
      type: String,
      default: 'Indian'
    },
    guardian: {
      name: { type: String, trim: true },
      relation: { type: String, default: 'Father' },
      phone: { type: String, trim: true },
      occupation: { type: String, trim: true },
      annualIncome: { type: Number, default: 0 }
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, default: 'West Bengal' },
      pincode: { type: String, trim: true }
    }
  },
  {
    timestamps: true
  }
);

const Applicant = mongoose.model('Applicant', applicantSchema);
export default Applicant;
