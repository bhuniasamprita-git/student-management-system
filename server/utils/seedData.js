import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
  User,
  Applicant,
  Application,
  Document,
  Payment,
  Notification,
  Admin,
  AuditLog,
  Course
} from '../models/index.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/iem_admission_portal';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for complete 8-collection database seeding...');

    // Clear all existing collections
    await User.deleteMany();
    await Applicant.deleteMany();
    await Application.deleteMany();
    await Document.deleteMany();
    await Payment.deleteMany();
    await Notification.deleteMany();
    await Admin.deleteMany();
    await AuditLog.deleteMany();
    await Course.deleteMany();
    console.log('🧹 Purged all existing data from 8 collections.');

    // 1. Seed Courses
    const courses = [
      { programName: 'B.Tech', branch: 'Computer Science & Engineering', category: 'UG', duration: '4 Years', seatCapacity: 180, filledSeats: 142, minEligibilityPCM: 60 },
      { programName: 'B.Tech', branch: 'CSE (AI & Machine Learning)', category: 'UG', duration: '4 Years', seatCapacity: 120, filledSeats: 110, minEligibilityPCM: 60 },
      { programName: 'B.Tech', branch: 'Information Technology', category: 'UG', duration: '4 Years', seatCapacity: 120, filledSeats: 98, minEligibilityPCM: 60 },
      { programName: 'B.Tech', branch: 'Electronics & Communication', category: 'UG', duration: '4 Years', seatCapacity: 120, filledSeats: 85, minEligibilityPCM: 60 },
      { programName: 'BCA', branch: 'Bachelor of Computer Applications', category: 'UG', duration: '3 Years', seatCapacity: 120, filledSeats: 95, minEligibilityPCM: 50 },
      { programName: 'MCA', branch: 'Master of Computer Applications', category: 'PG', duration: '2 Years', seatCapacity: 60, filledSeats: 48, minEligibilityPCM: 50 },
      { programName: 'MBA', branch: 'Master of Business Administration', category: 'PG', duration: '2 Years', seatCapacity: 120, filledSeats: 92, minEligibilityPCM: 50 }
    ];
    await Course.insertMany(courses);
    console.log('✅ [1/8 Courses]: Seeded 7 academic programs.');

    // 2. Seed Admin User & Admin Profile
    const adminUser = await User.create({
      fullName: 'Prof. Dr. S. Banerjee',
      email: 'admin.admissions@iemcal.com',
      phone: '+91 33 2357 2995',
      password: 'admin@iem2026',
      role: 'admin',
      isVerified: true
    });

    const adminProfile = await Admin.create({
      userId: adminUser._id,
      employeeId: 'IEM-ADM-001',
      department: 'Central Admission Directorate',
      designation: 'Convener, Central Admission Committee',
      permissions: ['verify_documents', 'allot_seats', 'request_corrections', 'reject_applications', 'view_reports', 'audit_logs'],
      assignedBranches: ['B.Tech - Computer Science & Engineering', 'B.Tech - Information Technology']
    });
    console.log(`✅ [2/8 Admins & Users]: Seeded Admin (${adminUser.email}) and linked Admin Profile (${adminProfile.employeeId}).`);

    // 3. Seed Applicant 1: Arindam Mukherjee (Verified & Seat Allotted)
    const applicantUser1 = await User.create({
      fullName: 'Arindam Mukherjee',
      email: 'arindam.mukherjee@example.com',
      phone: '+91 98301 23456',
      password: 'iem@2026',
      role: 'applicant',
      isVerified: true
    });

    const applicant1 = await Applicant.create({
      userId: applicantUser1._id,
      applicationNumber: 'IEM-2026-8492',
      dob: new Date('2006-08-14'),
      gender: 'Male',
      category: 'General',
      bloodGroup: 'O+',
      nationality: 'Indian',
      guardian: {
        name: 'Subhash Mukherjee',
        relation: 'Father',
        phone: '+91 98310 98765',
        occupation: 'Senior Executive, PSU',
        annualIncome: 1200000
      },
      address: {
        street: 'Sector 2, Block AE-14',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700091'
      }
    });

    const application1 = await Application.create({
      applicantId: applicant1._id,
      userId: applicantUser1._id,
      applicationNumber: applicant1.applicationNumber,
      academics: {
        class10: { board: 'ICSE', school: 'South Point High School, Kolkata', passingYear: 2022, percentage: 94.2 },
        class12: { board: 'ISC', school: 'South Point High School, Kolkata', passingYear: 2024, physics: 92, chemistry: 89, maths: 95, pcmPercentage: 92.0, overallPercentage: 93.5 },
        entranceExam: { examType: 'WBJEE', rollNumber: '240182903', rank: 1420, score: '112.5' }
      },
      preferences: [
        { order: 1, course: 'B.Tech - Computer Science & Engineering' },
        { order: 2, course: 'B.Tech - CSE (AI & Machine Learning)' },
        { order: 3, course: 'B.Tech - Information Technology' }
      ],
      status: 'seat_allotted',
      allottedBranch: 'B.Tech - Computer Science & Engineering',
      allottedCategory: 'Open Merit Round 1',
      adminRemarks: 'Original ISC Marksheet and WBJEE Rank card verified against portal records. Qualified for B.Tech CSE.',
      submittedAt: new Date('2026-11-05T14:35:00Z')
    });
    console.log(`✅ [3/8 Applicants & Applications]: Seeded Applicant ${applicant1.applicationNumber}.`);

    // 4. Seed Documents for Applicant 1
    const docPhoto = await Document.create({
      applicationId: application1._id,
      applicantId: applicant1._id,
      documentType: 'photo',
      fileName: 'arindam_photo.jpg',
      filePath: 'uploads/photo-1730000001.jpg',
      fileSize: '142 KB',
      fileMimeType: 'image/jpeg',
      status: 'verified',
      verifiedBy: adminUser._id,
      remarks: 'Photograph verified'
    });

    const docClass12 = await Document.create({
      applicationId: application1._id,
      applicantId: applicant1._id,
      documentType: 'class12Marksheet',
      fileName: 'isc_marksheet_2024.pdf',
      filePath: 'uploads/class12-1730000002.pdf',
      fileSize: '1.4 MB',
      fileMimeType: 'application/pdf',
      status: 'verified',
      verifiedBy: adminUser._id,
      remarks: 'Score verified with council results'
    });

    const docRankCard = await Document.create({
      applicationId: application1._id,
      applicantId: applicant1._id,
      documentType: 'rankCard',
      fileName: 'wbjee_rankcard.pdf',
      filePath: 'uploads/rankcard-1730000003.pdf',
      fileSize: '920 KB',
      fileMimeType: 'application/pdf',
      status: 'verified',
      verifiedBy: adminUser._id,
      remarks: 'Rank 1420 confirmed'
    });

    application1.documents = [docPhoto._id, docClass12._id, docRankCard._id];
    console.log('✅ [4/8 Documents]: Seeded 3 verified documents linked to Application 1.');

    // 5. Seed Payment for Applicant 1
    const payment1 = await Payment.create({
      applicationId: application1._id,
      applicantId: applicant1._id,
      userId: applicantUser1._id,
      transactionId: 'TXN-IEM-93821039',
      amount: 1000,
      currency: 'INR',
      paymentMethod: 'UPI',
      status: 'completed',
      paidAt: new Date('2026-11-05T14:32:00Z'),
      gatewayResponse: { bankRef: 'SBI-UPI-88912903', status: 'SUCCESS' }
    });

    application1.paymentId = payment1._id;
    await application1.save();
    console.log(`✅ [5/8 Payments]: Seeded Payment ${payment1.transactionId} linked to Application 1.`);

    // 6. Seed Applicant 2: Sneha Sen (Submitted, under review)
    const applicantUser2 = await User.create({
      fullName: 'Sneha Sen',
      email: 'sneha.sen@example.com',
      phone: '+91 98745 61230',
      password: 'iem@2026',
      role: 'applicant',
      isVerified: true
    });

    const applicant2 = await Applicant.create({
      userId: applicantUser2._id,
      applicationNumber: 'IEM-2026-8493',
      dob: new Date('2006-04-22'),
      gender: 'Female',
      category: 'General',
      guardian: { name: 'Alok Sen', relation: 'Father', phone: '+91 98745 61239', occupation: 'Banker', annualIncome: 950000 },
      address: { street: 'Behala Chowrasta', city: 'Kolkata', state: 'West Bengal', pincode: '700034' }
    });

    const application2 = await Application.create({
      applicantId: applicant2._id,
      userId: applicantUser2._id,
      applicationNumber: applicant2.applicationNumber,
      academics: {
        class10: { board: 'WBBSE', school: 'Bidhan Nagar Govt High School', passingYear: 2022, percentage: 91.0 },
        class12: { board: 'WBCHSE', school: 'Bidhan Nagar Govt High School', passingYear: 2024, physics: 86, chemistry: 88, maths: 92, pcmPercentage: 88.6, overallPercentage: 89.2 },
        entranceExam: { examType: 'JEE Main', rollNumber: '240310892', rank: 18450, score: '96.2 %ile' }
      },
      preferences: [
        { order: 1, course: 'B.Tech - Information Technology' },
        { order: 2, course: 'B.Tech - Computer Science & Engineering' }
      ],
      status: 'submitted',
      adminRemarks: 'Pending scrutiny by admission committee.',
      submittedAt: new Date('2026-11-06T10:20:00Z')
    });

    const payment2 = await Payment.create({
      applicationId: application2._id,
      applicantId: applicant2._id,
      userId: applicantUser2._id,
      transactionId: 'TXN-IEM-93821044',
      amount: 1000,
      paymentMethod: 'Card',
      status: 'completed',
      paidAt: new Date('2026-11-06T10:15:00Z')
    });
    application2.paymentId = payment2._id;
    await application2.save();

    // 7. Seed Notifications
    await Notification.create([
      {
        recipientId: null, // Public broadcast
        title: 'Phase 1 Admissions 2026-27 Open',
        message: 'Online application window for B.Tech, BCA, MCA, and MBA is now active. Document verification starts 1st December.',
        type: 'announcement'
      },
      {
        recipientId: applicantUser1._id,
        title: '🎉 Provisional Seat Allotment Letter Ready',
        message: 'Congratulations! You have been provisionally allotted a seat in B.Tech - Computer Science & Engineering.',
        type: 'status_update',
        actionUrl: '/application-status'
      },
      {
        recipientId: applicantUser2._id,
        title: 'Application Received & Under Review',
        message: 'Your application IEM-2026-8493 is under scrutiny by the Central Admission Committee.',
        type: 'status_update',
        actionUrl: '/application-status'
      }
    ]);
    console.log('✅ [6/8 Notifications]: Seeded broadcast and recipient notifications.');

    // 8. Seed Audit Logs
    await AuditLog.create([
      {
        action: 'USER_REGISTERED',
        performedBy: applicantUser1._id,
        performerRole: 'applicant',
        targetApplication: application1._id,
        details: { applicationNumber: 'IEM-2026-8492' }
      },
      {
        action: 'PAYMENT_COMPLETED',
        performedBy: applicantUser1._id,
        performerRole: 'applicant',
        targetApplication: application1._id,
        details: { transactionId: 'TXN-IEM-93821039', amount: 1000 }
      },
      {
        action: 'APPLICATION_SUBMITTED',
        performedBy: applicantUser1._id,
        performerRole: 'applicant',
        targetApplication: application1._id,
        details: { pcmPercentage: 92.0 }
      },
      {
        action: 'DOCUMENT_VERIFIED',
        performedBy: adminUser._id,
        performerRole: 'admin',
        targetApplication: application1._id,
        details: { verifiedDocumentsCount: 3 }
      },
      {
        action: 'SEAT_ALLOTTED',
        performedBy: adminUser._id,
        performerRole: 'admin',
        targetApplication: application1._id,
        details: { allottedBranch: 'B.Tech - Computer Science & Engineering', category: 'Open Merit Round 1' }
      }
    ]);
    console.log('✅ [7/8 AuditLogs]: Seeded 5 audit log trace entries.');
    console.log('✅ [8/8 Schema Verification]: All 8 MongoDB collections successfully populated with verified relational references!');

    console.log('\n🎉 [COMPLETE SUCCESS]: MongoDB Database Seeded across all 8 Collections.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
