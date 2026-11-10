/**
 * IEM Admission Portal — Central API Client
 * Connects React frontend components to Node.js & Express REST APIs
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Helper for standard JSON headers with JWT Bearer token
const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('iem_token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic Fetch Wrapper
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// ================= AUTHENTICATION APIS =================

export const authAPI = {
  // Register Applicant
  register: async (payload) => {
    const data = await request('/auth/register', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (data.token) {
      localStorage.setItem('iem_token', data.token);
    }
    return data;
  },

  // Applicant & User Login
  login: async (identifier, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ identifier, password })
    });
    if (data.token) {
      localStorage.setItem('iem_token', data.token);
    }
    return data;
  },

  // Admin Dedicated Login
  adminLogin: async (email, password) => {
    const data = await request('/auth/admin-login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      localStorage.setItem('iem_token', data.token);
    }
    return data;
  },

  // Get Current Authenticated User
  getMe: async () => {
    return await request('/auth/me', {
      method: 'GET',
      headers: getHeaders()
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('iem_token');
  }
};

// ================= APPLICANT PORTAL APIS =================

export const applicationAPI = {
  // Get Logged-in Applicant's Application
  getMyApplication: async () => {
    return await request('/application/my-application', {
      method: 'GET',
      headers: getHeaders()
    });
  },

  // Save Application Form Draft
  saveDraft: async (formData) => {
    return await request('/application/save-draft', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(formData)
    });
  },

  // Final Submit Application
  submit: async () => {
    return await request('/application/submit', {
      method: 'POST',
      headers: getHeaders()
    });
  },

  // Upload Document (Multipart File Upload)
  uploadDocument: async (docType, file) => {
    const formData = new FormData();
    formData.append('docType', docType);
    formData.append('document', file);

    return await request('/application/upload-document', {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
  },

  // Process Demo Fee Payment
  processPayment: async (paymentMethod = 'UPI') => {
    return await request('/application/process-payment', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ paymentMethod })
    });
  },

  // Get Applicant Notifications
  getNotifications: async () => {
    return await request('/application/notifications', {
      method: 'GET',
      headers: getHeaders()
    });
  }
};

// ================= ADMIN PORTAL APIS =================

export const adminAPI = {
  // Get Dashboard Analytics
  getDashboardStats: async () => {
    return await request('/admin/dashboard-stats', {
      method: 'GET',
      headers: getHeaders()
    });
  },

  // Get Applications with Search and Filter
  getApplications: async ({ status = 'all', branch = 'all', search = '' } = {}) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (branch && branch !== 'all') params.append('branch', branch);
    if (search) params.append('search', search);

    return await request(`/admin/applications?${params.toString()}`, {
      method: 'GET',
      headers: getHeaders()
    });
  },

  // Get Single Application Details
  getApplicationById: async (id) => {
    return await request(`/admin/application/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
  },

  // Update Status / Allot Branch / Add Remarks
  updateStatus: async (id, { status, allottedBranch, allottedCategory, adminRemarks }) => {
    return await request(`/admin/application/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, allottedBranch, allottedCategory, adminRemarks })
    });
  }
};
