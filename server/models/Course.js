import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    programName: {
      type: String,
      required: true,
      trim: true
    },
    branch: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['UG', 'PG'],
      default: 'UG'
    },
    duration: {
      type: String,
      default: '4 Years'
    },
    seatCapacity: {
      type: Number,
      required: true,
      default: 120
    },
    filledSeats: {
      type: Number,
      default: 0
    },
    minEligibilityPCM: {
      type: Number,
      default: 60 // 60% in PCM aggregate
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
