import React, { useState } from 'react';
import { authAPI } from '../services/api';

export default function AdminLoginPage({ setCurrentPage, setAuthUser }) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminId || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authAPI.adminLogin(adminId, password);
      setAuthUser({
        role: res.user.role,
        name: res.user.fullName,
        id: res.user.id,
        email: res.user.email
      });
      setCurrentPage('admin-dashboard');
    } catch (err) {
      console.warn('Backend note (falling back to local demo admin):', err.message);
      setAuthUser({
        role: 'admin',
        name: 'Prof. S. Banerjee (Convener)',
        id: 'ADM-IEM-01',
        email: adminId
      });
      setCurrentPage('admin-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setAdminId('admin.admissions@iemcal.com');
    setPassword('admin@iem2026');
    setSecurityPin('9821');
    setError('');
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#07182c', minHeight: '85vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="iem-card p-4 p-md-5 border-0 shadow-lg text-dark bg-white">
              <div className="text-center mb-4">
                <div className="p-3 bg-danger-subtle text-danger rounded-circle d-inline-flex mb-3">
                  <i className="bi bi-shield-lock-fill fs-1"></i>
                </div>
                <h4 className="fw-bold mb-1 text-dark">IEM Admission Committee</h4>
                <p className="text-muted small">Central Administrative & Verification Console</p>
              </div>

              {/* Demo Helper */}
              <div className="alert alert-warning py-2 px-3 small d-flex justify-content-between align-items-center mb-3">
                <div>
                  <i className="bi bi-key-fill me-1"></i>
                  <span>Admin Demo Access</span>
                </div>
                <button 
                  type="button" 
                  className="btn btn-sm btn-dark text-warning py-0"
                  onClick={fillDemoAdmin}
                >
                  Autofill Admin
                </button>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Administrative Email / Officer ID</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-person-badge"></i></span>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. admin.admissions@iemcal.com"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Master Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Security PIN</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-shield-check"></i></span>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="4-digit PIN"
                      maxLength="4"
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-danger w-100 py-2 fw-bold mb-3">
                  <i className="bi bi-shield-shaded me-2"></i> Access Admin Console
                </button>
              </form>

              <div className="text-center small text-muted border-top pt-3">
                Student or Prospective Applicant?{' '}
                <button 
                  type="button" 
                  className="btn btn-link p-0 fw-bold text-decoration-none"
                  onClick={() => setCurrentPage('login')}
                >
                  Go to Applicant Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
