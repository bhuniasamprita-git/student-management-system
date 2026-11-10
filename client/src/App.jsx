import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ApplicantDashboard from './pages/ApplicantDashboard';
import ApplicationFormPage from './pages/ApplicationFormPage';
import DocumentUploadPage from './pages/DocumentUploadPage';
import PaymentPage from './pages/PaymentPage';
import ApplicationStatusPage from './pages/ApplicationStatusPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ApplicationVerificationPage from './pages/ApplicationVerificationPage';

import { INITIAL_APPLICANT, SAMPLE_ALL_APPLICANTS } from './data/sampleData';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authUser, setAuthUser] = useState(null); // null, { role: 'applicant', name, id }, { role: 'admin', name, id }
  const [applicantData, setApplicantData] = useState(INITIAL_APPLICANT);
  const [applicantsList, setApplicantsList] = useState(SAMPLE_ALL_APPLICANTS);
  const [selectedApplicantId, setSelectedApplicantId] = useState('usr_01');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Keep single applicant and list in sync if usr_01 updates
  useEffect(() => {
    setApplicantsList(prev => 
      prev.map(app => (app.id === applicantData.id ? applicantData : app))
    );
  }, [applicantData]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} setApplicantData={setApplicantData} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} />;
      case 'forgot-password':
        return <ForgotPasswordPage setCurrentPage={setCurrentPage} />;
      case 'applicant-dashboard':
        return <ApplicantDashboard applicantData={applicantData} setCurrentPage={setCurrentPage} />;
      case 'application-form':
        return <ApplicationFormPage applicantData={applicantData} setApplicantData={setApplicantData} setCurrentPage={setCurrentPage} />;
      case 'document-upload':
        return <DocumentUploadPage applicantData={applicantData} setApplicantData={setApplicantData} setCurrentPage={setCurrentPage} />;
      case 'payment':
        return <PaymentPage applicantData={applicantData} setApplicantData={setApplicantData} setCurrentPage={setCurrentPage} />;
      case 'application-status':
        return <ApplicationStatusPage applicantData={applicantData} setApplicantData={setApplicantData} setCurrentPage={setCurrentPage} />;
      case 'admin-login':
        return <AdminLoginPage setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} />;
      case 'admin-dashboard':
        return (
          <AdminDashboardPage 
            applicantsList={applicantsList} 
            setSelectedApplicantId={setSelectedApplicantId} 
            setCurrentPage={setCurrentPage} 
          />
        );
      case 'application-verification':
        return (
          <ApplicationVerificationPage 
            selectedApplicantId={selectedApplicantId} 
            applicantsList={applicantsList} 
            setApplicantsList={setApplicantsList} 
            setCurrentPage={setCurrentPage} 
          />
        );
      default:
        return <HomePage setCurrentPage={setCurrentPage} setAuthUser={setAuthUser} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        authUser={authUser} 
        setAuthUser={setAuthUser}
        setSelectedApplicantId={setSelectedApplicantId}
      />
      
      <main className="flex-grow-1">
        {renderCurrentPage()}
      </main>

      <Footer 
        setCurrentPage={setCurrentPage} 
        setAuthUser={setAuthUser} 
      />
    </div>
  );
}
