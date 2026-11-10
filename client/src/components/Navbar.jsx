import React from 'react';

export default function Navbar({ currentPage, setCurrentPage, authUser, setAuthUser, setSelectedApplicantId }) {
  const handleLogout = () => {
    setAuthUser(null);
    setCurrentPage('home');
  };

  const pagesList = [
    { id: 'home', label: '1. Home Page', icon: 'bi-house' },
    { id: 'register', label: '2. Applicant Registration', icon: 'bi-person-plus' },
    { id: 'login', label: '3. Applicant Login', icon: 'bi-box-arrow-in-right' },
    { id: 'forgot-password', label: '4. Forgot Password', icon: 'bi-key' },
    { id: 'applicant-dashboard', label: '5. Applicant Dashboard', icon: 'bi-speedometer2' },
    { id: 'application-form', label: '6. Admission Application Form', icon: 'bi-pencil-square' },
    { id: 'document-upload', label: '7. Document Upload Page', icon: 'bi-cloud-arrow-up' },
    { id: 'payment', label: '8. Payment Page', icon: 'bi-credit-card' },
    { id: 'application-status', label: '9. Application Status & Receipt', icon: 'bi-file-earmark-check' },
    { id: 'admin-login', label: '10. Admin Login', icon: 'bi-shield-lock' },
    { id: 'admin-dashboard', label: '11. Admin Dashboard', icon: 'bi-kanban' },
    { id: 'application-verification', label: '12. Application Verification', icon: 'bi-check2-circle' },
  ];

  return (
    <header className="sticky-top">
      {/* Top Contact Strip */}
      <div className="iem-topbar d-none d-md-block">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <span className="me-3"><i className="bi bi-telephone-fill text-warning me-1"></i> Helpline: +91 33 2357 2995 / 2059</span>
            <span><i className="bi bi-envelope-fill text-warning me-1"></i> admissions@iemcal.com</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-warning text-dark fw-bold">Admissions Open 2026-27</span>
            <span>NAAC 'A' Grade | NBA Accredited</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-iem navbar-dark">
        <div className="container">
          <button 
            type="button" 
            className="navbar-brand-iem btn btn-link p-0 text-start"
            onClick={() => setCurrentPage('home')}
          >
            <div className="iem-logo-badge">IEM</div>
            <div>
              <div className="iem-brand-title">Institute of Engineering & Management</div>
              <div className="iem-brand-sub">Kolkata, West Bengal • Established 1989</div>
            </div>
          </button>

          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <button 
                  className={`nav-link nav-link-iem btn btn-link ${currentPage === 'home' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('home')}
                >
                  <i className="bi bi-house me-1"></i> Home
                </button>
              </li>

              {/* Applicant Navigation Items */}
              {authUser?.role === 'applicant' && (
                <>
                  <li className="nav-item">
                    <button 
                      className={`nav-link nav-link-iem btn btn-link ${currentPage === 'applicant-dashboard' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('applicant-dashboard')}
                    >
                      <i className="bi bi-speedometer2 me-1"></i> Dashboard
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link nav-link-iem btn btn-link ${currentPage === 'application-form' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('application-form')}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Form
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link nav-link-iem btn btn-link ${currentPage === 'document-upload' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('document-upload')}
                    >
                      <i className="bi bi-cloud-arrow-up me-1"></i> Documents
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link nav-link-iem btn btn-link ${currentPage === 'payment' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('payment')}
                    >
                      <i className="bi bi-credit-card me-1"></i> Payment
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link nav-link-iem btn btn-link ${currentPage === 'application-status' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('application-status')}
                    >
                      <i className="bi bi-file-earmark-check me-1"></i> Status
                    </button>
                  </li>
                </>
              )}

              {/* Admin Navigation Items */}
              {authUser?.role === 'admin' && (
                <>
                  <li className="nav-item">
                    <button 
                      className={`nav-link nav-link-iem btn btn-link ${currentPage === 'admin-dashboard' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('admin-dashboard')}
                    >
                      <i className="bi bi-kanban me-1"></i> Admin Console
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link nav-link-iem btn btn-link ${currentPage === 'application-verification' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedApplicantId('usr_01');
                        setCurrentPage('application-verification');
                      }}
                    >
                      <i className="bi bi-check2-circle me-1"></i> Verification
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* Quick Demo Page Switcher & Auth Actions */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Quick Jump Dropdown for Testing All 12 Pages */}
              <div className="dropdown">
                <button 
                  className="btn quick-nav-pill dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-compass me-1"></i> Switch Page ({pagesList.find(p => p.id === currentPage)?.label.split(' ')[0] || 'Nav'})
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  <li className="dropdown-header text-uppercase fw-bold text-muted small">All 12 Portal Pages</li>
                  {pagesList.map(page => (
                    <li key={page.id}>
                      <button 
                        className={`dropdown-item py-2 d-flex align-items-center gap-2 ${currentPage === page.id ? 'active fw-bold' : ''}`}
                        onClick={() => {
                          if (page.id === 'applicant-dashboard' || page.id === 'application-form' || page.id === 'document-upload' || page.id === 'payment' || page.id === 'application-status') {
                            if (!authUser || authUser.role !== 'applicant') {
                              setAuthUser({ role: 'applicant', name: 'Arindam Mukherjee', id: 'usr_01' });
                            }
                          } else if (page.id === 'admin-dashboard' || page.id === 'application-verification') {
                            if (!authUser || authUser.role !== 'admin') {
                              setAuthUser({ role: 'admin', name: 'Admission Officer', id: 'adm_01' });
                            }
                          }
                          setCurrentPage(page.id);
                        }}
                      >
                        <i className={`bi ${page.icon} text-primary`}></i>
                        <span>{page.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Login / User Status */}
              {authUser ? (
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${authUser.role === 'admin' ? 'bg-danger' : 'bg-success'} d-flex align-items-center gap-1 py-2 px-3`}>
                    <i className={`bi ${authUser.role === 'admin' ? 'bi-shield-check' : 'bi-person-check'}`}></i>
                    <span>{authUser.name} ({authUser.role})</span>
                  </span>
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                    title="Sign Out"
                  >
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <button 
                    className="btn btn-outline-light btn-sm px-3"
                    onClick={() => setCurrentPage('login')}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Applicant Login
                  </button>
                  <button 
                    className="btn btn-iem-primary btn-sm px-3"
                    onClick={() => setCurrentPage('register')}
                  >
                    Apply Now
                  </button>
                  <button 
                    className="btn btn-dark btn-sm text-warning"
                    onClick={() => setCurrentPage('admin-login')}
                    title="Administrative Access"
                  >
                    <i className="bi bi-shield-lock me-1"></i> Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
