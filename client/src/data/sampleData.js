// IEM Admission Portal - Sample Seed Data

export const INITIAL_PROGRAMS = [
  {
    id: 'btech-cse',
    name: 'B.Tech - Computer Science & Engineering',
    category: 'Engineering (UG)',
    duration: '4 Years (8 Semesters)',
    seats: 180,
    filled: 142,
    eligibility: '10+2 with Physics, Mathematics & Chemistry (Min 60% PCM Aggregate). Valid WBJEE / JEE Main rank.',
    icon: 'bi-laptop'
  },
  {
    id: 'btech-cseal',
    name: 'B.Tech - CSE (AI & Machine Learning)',
    category: 'Engineering (UG)',
    duration: '4 Years (8 Semesters)',
    seats: 120,
    filled: 110,
    eligibility: '10+2 with Physics, Mathematics & Chemistry (Min 60% PCM Aggregate). Valid WBJEE / JEE Main rank.',
    icon: 'bi-cpu'
  },
  {
    id: 'btech-it',
    name: 'B.Tech - Information Technology',
    category: 'Engineering (UG)',
    duration: '4 Years (8 Semesters)',
    seats: 120,
    filled: 98,
    eligibility: '10+2 with Physics, Mathematics & Chemistry (Min 60% PCM Aggregate). Valid WBJEE / JEE Main rank.',
    icon: 'bi-hdd-network'
  },
  {
    id: 'btech-ece',
    name: 'B.Tech - Electronics & Communication',
    category: 'Engineering (UG)',
    duration: '4 Years (8 Semesters)',
    seats: 120,
    filled: 85,
    eligibility: '10+2 with PCM (Min 60%). Valid WBJEE / JEE Main rank.',
    icon: 'bi-broadcast-pin'
  },
  {
    id: 'bca',
    name: 'BCA (Bachelor of Computer Applications)',
    category: 'Computer Applications (UG)',
    duration: '3 Years (6 Semesters)',
    seats: 120,
    filled: 95,
    eligibility: '10+2 with Mathematics / Computer Science / Statistics / Informatics Practices (Min 50%).',
    icon: 'bi-code-slash'
  },
  {
    id: 'mca',
    name: 'MCA (Master of Computer Applications)',
    category: 'Computer Applications (PG)',
    duration: '2 Years (4 Semesters)',
    seats: 60,
    filled: 48,
    eligibility: 'BCA / B.Sc (CS/IT) or graduation with Mathematics at 10+2 / Degree level. Valid WB-JECA rank.',
    icon: 'bi-diagram-3'
  },
  {
    id: 'mba',
    name: 'MBA (Master of Business Administration)',
    category: 'Management (PG)',
    duration: '2 Years (4 Semesters)',
    seats: 120,
    filled: 92,
    eligibility: 'Graduation in any discipline with min 50%. CAT / MAT / JEMAT / IEMJEE Score.',
    icon: 'bi-graph-up-arrow'
  }
];

export const INITIAL_APPLICANT = {
  id: 'usr_01',
  applicationNumber: 'IEM-2026-8492',
  fullName: 'Arindam Mukherjee',
  email: 'arindam.mukherjee@example.com',
  phone: '+91 98301 23456',
  gender: 'Male',
  dob: '2006-08-14',
  category: 'General',
  bloodGroup: 'O+',
  nationality: 'Indian',
  guardianName: 'Subhash Mukherjee',
  guardianRelation: 'Father',
  guardianPhone: '+91 98310 98765',
  guardianOccupation: 'Senior Executive, PSU',
  annualFamilyIncome: '1200000',
  address: 'Salt Lake City, Sector 2, Block AE-14',
  city: 'Kolkata',
  state: 'West Bengal',
  pincode: '700091',

  // Academics
  academics: {
    class10: {
      board: 'ICSE',
      school: 'South Point High School, Kolkata',
      passingYear: '2022',
      percentage: '94.2'
    },
    class12: {
      board: 'ISC',
      school: 'South Point High School, Kolkata',
      passingYear: '2024',
      physics: '92',
      chemistry: '89',
      maths: '95',
      pcmPercentage: '92.0',
      overallPercentage: '93.5'
    },
    entranceExam: {
      examType: 'WBJEE',
      rollNumber: '240182903',
      rank: '1420',
      score: '112.5'
    }
  },

  // Preferences
  preferences: [
    { order: 1, course: 'B.Tech - Computer Science & Engineering' },
    { order: 2, course: 'B.Tech - CSE (AI & Machine Learning)' },
    { order: 3, course: 'B.Tech - Information Technology' }
  ],

  // Documents
  documents: {
    photo: { uploaded: true, filename: 'arindam_photo.jpg', status: 'verified', size: '142 KB' },
    signature: { uploaded: true, filename: 'arindam_signature.png', status: 'verified', size: '86 KB' },
    class10Marksheet: { uploaded: true, filename: 'icse_marksheet.pdf', status: 'verified', size: '1.2 MB' },
    class12Marksheet: { uploaded: true, filename: 'isc_marksheet.pdf', status: 'verified', size: '1.4 MB' },
    rankCard: { uploaded: true, filename: 'wbjee_rankcard_2026.pdf', status: 'verified', size: '920 KB' },
    categoryCertificate: { uploaded: false, filename: null, status: 'not_required', size: null }
  },

  // Payment
  payment: {
    status: 'completed',
    amount: 1000,
    transactionId: 'TXN-IEM-93821039',
    paymentDate: '2026-11-05 14:32 IST',
    paymentMethod: 'UPI (Google Pay)'
  },

  // Overall Admission Status
  status: 'verified', // 'draft', 'submitted', 'under_review', 'verified', 'seat_allotted', 'rejected', 'admitted'
  allottedBranch: 'B.Tech - Computer Science & Engineering',
  allottedCategory: 'Open Merit Round 1',
  adminRemarks: 'Original ISC Marksheet and WBJEE Rank card verified. Qualified for B.Tech CSE under general merit quota.',
  submittedAt: '2026-11-05 14:35 IST',
  lastUpdated: '2026-11-08 11:20 IST'
};

export const SAMPLE_ALL_APPLICANTS = [
  INITIAL_APPLICANT,
  {
    id: 'usr_02',
    applicationNumber: 'IEM-2026-8493',
    fullName: 'Sneha Sen',
    email: 'sneha.sen@example.com',
    phone: '+91 98745 61230',
    gender: 'Female',
    dob: '2006-04-22',
    category: 'General',
    bloodGroup: 'B+',
    address: 'Behala Chowrasta, Kolkata - 700034',
    city: 'Kolkata',
    state: 'West Bengal',
    academics: {
      class10: { board: 'WBBSE', school: 'Bidhan Nagar Govt High School', passingYear: '2022', percentage: '91.0' },
      class12: { board: 'WBCHSE', school: 'Bidhan Nagar Govt High School', passingYear: '2024', pcmPercentage: '88.6', overallPercentage: '89.2' },
      entranceExam: { examType: 'JEE Main', rollNumber: '240310892', rank: '18450', score: '96.2 %ile' }
    },
    preferences: [
      { order: 1, course: 'B.Tech - Information Technology' },
      { order: 2, course: 'B.Tech - Computer Science & Engineering' }
    ],
    documents: {
      photo: { uploaded: true, filename: 'sneha_photo.jpg', status: 'verified', size: '120 KB' },
      signature: { uploaded: true, filename: 'sneha_sign.png', status: 'verified', size: '65 KB' },
      class10Marksheet: { uploaded: true, filename: 'wbbse_class10.pdf', status: 'verified', size: '1.1 MB' },
      class12Marksheet: { uploaded: true, filename: 'wbchse_class12.pdf', status: 'verified', size: '1.3 MB' },
      rankCard: { uploaded: true, filename: 'jeemain_rankcard.pdf', status: 'verified', size: '850 KB' }
    },
    payment: { status: 'completed', amount: 1000, transactionId: 'TXN-IEM-93821044', paymentDate: '2026-11-06 10:15 IST', paymentMethod: 'Card' },
    status: 'submitted',
    allottedBranch: null,
    adminRemarks: 'Pending initial scrutiny by admission committee.',
    submittedAt: '2026-11-06 10:20 IST'
  },
  {
    id: 'usr_03',
    applicationNumber: 'IEM-2026-8494',
    fullName: 'Rahul Chakraborty',
    email: 'rahul.c@example.com',
    phone: '+91 98311 44556',
    gender: 'Male',
    dob: '2005-11-19',
    category: 'General',
    bloodGroup: 'A+',
    address: 'Howrah Station Road, Howrah - 711101',
    city: 'Howrah',
    state: 'West Bengal',
    academics: {
      class10: { board: 'CBSE', school: 'DPS Megacity', passingYear: '2022', percentage: '84.0' },
      class12: { board: 'CBSE', school: 'DPS Megacity', passingYear: '2024', pcmPercentage: '79.2', overallPercentage: '81.4' },
      entranceExam: { examType: 'IEMJEE', rollNumber: 'IEM249102', rank: '412', score: '88/100' }
    },
    preferences: [
      { order: 1, course: 'B.Tech - Electronics & Communication' },
      { order: 2, course: 'B.Tech - Electrical Engineering' }
    ],
    documents: {
      photo: { uploaded: true, filename: 'rahul_photo.jpg', status: 'pending', size: '110 KB' },
      signature: { uploaded: true, filename: 'rahul_sign.png', status: 'pending', size: '70 KB' },
      class10Marksheet: { uploaded: true, filename: 'cbse_10th.pdf', status: 'pending', size: '1.0 MB' },
      class12Marksheet: { uploaded: true, filename: 'cbse_12th.pdf', status: 'pending', size: '1.2 MB' },
      rankCard: { uploaded: true, filename: 'iemjee_rank.pdf', status: 'pending', size: '780 KB' }
    },
    payment: { status: 'completed', amount: 1000, transactionId: 'TXN-IEM-93821051', paymentDate: '2026-11-07 16:40 IST', paymentMethod: 'Net Banking' },
    status: 'under_review',
    allottedBranch: null,
    adminRemarks: 'Marksheets under verification with CBSE database.',
    submittedAt: '2026-11-07 16:45 IST'
  },
  {
    id: 'usr_04',
    applicationNumber: 'IEM-2026-8495',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 97480 33221',
    gender: 'Female',
    dob: '2006-02-10',
    category: 'General',
    bloodGroup: 'AB+',
    address: 'Lake Gardens, Kolkata - 700045',
    city: 'Kolkata',
    state: 'West Bengal',
    academics: {
      class10: { board: 'CBSE', school: 'Mahadevi Birla World Academy', passingYear: '2022', percentage: '96.4' },
      class12: { board: 'CBSE', school: 'Mahadevi Birla World Academy', passingYear: '2024', pcmPercentage: '94.8', overallPercentage: '95.5' },
      entranceExam: { examType: 'WBJEE', rollNumber: '240182811', rank: '890', score: '124.0' }
    },
    preferences: [
      { order: 1, course: 'B.Tech - Computer Science & Engineering' }
    ],
    documents: {
      photo: { uploaded: true, filename: 'priya_photo.jpg', status: 'verified', size: '150 KB' },
      signature: { uploaded: true, filename: 'priya_sign.png', status: 'verified', size: '80 KB' },
      class10Marksheet: { uploaded: true, filename: 'marksheet_10.pdf', status: 'verified', size: '1.3 MB' },
      class12Marksheet: { uploaded: true, filename: 'marksheet_12.pdf', status: 'verified', size: '1.5 MB' },
      rankCard: { uploaded: true, filename: 'wbjee_rank.pdf', status: 'verified', size: '900 KB' }
    },
    payment: { status: 'completed', amount: 1000, transactionId: 'TXN-IEM-93821060', paymentDate: '2026-11-04 11:20 IST', paymentMethod: 'UPI' },
    status: 'seat_allotted',
    allottedBranch: 'B.Tech - Computer Science & Engineering',
    allottedCategory: 'Open Merit Top 1000',
    adminRemarks: 'Direct round 1 seat allotted based on WBJEE Rank 890.',
    submittedAt: '2026-11-04 11:25 IST'
  },
  {
    id: 'usr_05',
    applicationNumber: 'IEM-2026-8496',
    fullName: 'Debanjan Roy',
    email: 'debanjan.roy@example.com',
    phone: '+91 98322 77889',
    gender: 'Male',
    dob: '2005-09-03',
    category: 'OBC-A',
    bloodGroup: 'B+',
    address: 'Siliguri Town, Darjeeling - 734001',
    city: 'Siliguri',
    state: 'West Bengal',
    academics: {
      class10: { board: 'WBBSE', school: 'Siliguri Boys High School', passingYear: '2022', percentage: '75.0' },
      class12: { board: 'WBCHSE', school: 'Siliguri Boys High School', passingYear: '2024', pcmPercentage: '68.0', overallPercentage: '70.5' },
      entranceExam: { examType: 'WBJEE', rollNumber: '240199120', rank: '14200', score: '62.0' }
    },
    preferences: [
      { order: 1, course: 'B.Tech - Electrical Engineering' },
      { order: 2, course: 'B.Tech - Electronics & Communication' }
    ],
    documents: {
      photo: { uploaded: true, filename: 'debanjan_pic.jpg', status: 'verified', size: '130 KB' },
      signature: { uploaded: true, filename: 'debanjan_sign.png', status: 'verified', size: '75 KB' },
      class10Marksheet: { uploaded: true, filename: 'doc10.pdf', status: 'verified', size: '1.1 MB' },
      class12Marksheet: { uploaded: true, filename: 'doc12.pdf', status: 'correction_required', size: '800 KB' },
      rankCard: { uploaded: true, filename: 'rank.pdf', status: 'verified', size: '700 KB' }
    },
    payment: { status: 'completed', amount: 1000, transactionId: 'TXN-IEM-93821077', paymentDate: '2026-11-07 19:10 IST', paymentMethod: 'Card' },
    status: 'correction_required',
    allottedBranch: null,
    adminRemarks: 'Class 12 marksheet uploaded is blurry. Please re-upload a clear scanned copy of both front and back sides.',
    submittedAt: '2026-11-07 19:15 IST'
  }
];

export const IMPORTANT_NOTICES = [
  { id: 1, date: '10 Nov 2026', title: 'Phase 1 Online Admission Registration Open for 2026-27 Academic Session', isNew: true },
  { id: 2, date: '08 Nov 2026', title: 'IEMJEE 2026 Examination Slot Booking now available for All B.Tech / BCA / MCA aspirants', isNew: true },
  { id: 3, date: '01 Nov 2026', title: 'Schedule for Verification of Academic Documents and Category Certificates announced', isNew: false },
  { id: 4, date: '25 Oct 2026', title: 'IEM Placement Milestone: 100% placement achieved with Highest CTC of ₹72 LPA', isNew: false }
];
