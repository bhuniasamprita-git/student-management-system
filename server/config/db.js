import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/iem_admission_portal';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.warn('⚠️ Make sure your MongoDB service (Compass, Docker, or Atlas) is running.');
  }
};
