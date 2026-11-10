import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      default: 1000
    },
    currency: {
      type: String,
      default: 'INR'
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'NetBanking', 'DemandDraft'],
      default: 'UPI'
    },
    paymentGateway: {
      type: String,
      default: 'Simulated Gateway'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: {
      type: Date
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
