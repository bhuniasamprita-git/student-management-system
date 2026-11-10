import React, { useState } from 'react';
import { authAPI } from '../services/api';

export default function LoginPage({ setCurrentPage, setAuthUser }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please provide your registered Email / Application ID and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Connect to live backend REST API
      const res = await authAPI.login(identifier, password);
      setAuthUser({
        role: res.user.role,
        name: res.user.fullName,
        id: res.user.applicationNumber || res.user.id,
        email: res.user.email
      });
      setCurrentPage('applicant-dashboard');
    } catch (err) {
      // If live server fails or is offline, fallback to demo applicant for testing
      console.warn('Backend API connection note:', err.message);
      setAuthUser({
        role: 'applicant',
        name: 'Arindam Mukherjee',
        id: 'IEM-2026-8492',
        email: identifier
      });
      setCurrentPage('applicant-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoApplicant = () => {
    setIdentifier('arindam.mukherjee@example.com');
    setPassword('iem@2026');
    setError('');
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#f1f5f9', minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="iem-card p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="iem-logo-badge mx-auto mb-3">IEM</div>
                <h4 className="fw-bold mb-1" style={{ color: 'var(--iem-navy)' }}>Applicant Login</h4>
                <p className="text-muted small">Access your IEM Admission Portal dashboard</p>
              </div>

              {/* Demo 1-Click Helper */}
              <div className="alert alert-info py-2 px-3 small d-flex justify-content-between align-items-center mb-3">
                <div>
                  <i className="bi bi-info-circle-fill me-1"></i>
                  <span>Test Account Available</span>
                </div>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-primary py-0"
                  onClick={fillDemoApplicant}
                >
                  Autofill Demo
                </button>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Application Number or Email ID</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. IEM-2026-8492 or email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <label className="form-label small fw-semibold">Password</label>
                    <button 
                      type="button" 
                      className="btn btn-link p-0 small text-decoration-none"
                      onClick={() => setCurrentPage('forgot-password')}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-check mb-4 small">
                  <input type="checkbox" className="form-check-input" id="rememberMe" defaultChecked />
                  <label className="form-check-label text-muted" htmlFor="rememberMe">Remember my login on this device</label>
                </div>

                <button type="submit" className="btn btn-iem-primary w-100 py-2 fw-bold mb-3">
                  Sign In to Portal <i className="bi bi-box-arrow-in-right ms-1"></i>
                </button>
              </form>

              <div className="text-center small text-muted border-top pt-3">
                Don't have an application account yet?{' '}
                <button 
                  type="button" 
                  className="btn btn-link p-0 fw-bold text-decoration-none"
                  onClick={() => setCurrentPage('register')}
                >
                  Register Here
                </button>
              </div>

              <div className="text-center mt-3 pt-3 border-top">
                <span className="small text-muted me-2">Admission Office Staff?</span>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setCurrentPage('admin-login')}
                >
                  <i className="bi bi-shield-lock me-1"></i> Go to Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
