import React, { useState } from 'react';

export default function ForgotPasswordPage({ setCurrentPage }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const mockOtpCode = '582914';

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== mockOtpCode && otp !== '123456') {
      setError(`Invalid OTP. Use demo verification code: ${mockOtpCode}`);
      return;
    }
    setError('');
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setStep(4);
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#f1f5f9', minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="iem-card p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="p-3 bg-primary-subtle text-primary rounded-circle d-inline-flex mb-3">
                  <i className="bi bi-shield-lock-fill fs-2"></i>
                </div>
                <h4 className="fw-bold mb-1" style={{ color: 'var(--iem-navy)' }}>Reset Password</h4>
                <p className="text-muted small">Recover your IEM Admission Portal credentials</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Email input */}
              {step === 1 && (
                <form onSubmit={handleSendOtp}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Registered Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="e.g. arindam.mukherjee@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="form-text small">We will send a 6-digit verification code to this address.</div>
                  </div>
                  <button type="submit" className="btn btn-iem-primary w-100 py-2 fw-bold mb-3">
                    Send Verification Code <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp}>
                  <div className="alert alert-warning py-2 small mb-3">
                    <i className="bi bi-info-circle-fill me-1"></i>
                    Demo OTP code sent to <strong>{email}</strong>: <strong className="text-dark">{mockOtpCode}</strong>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Enter 6-Digit OTP</label>
                    <input 
                      type="text" 
                      className="form-control text-center fs-4 letter-spacing-2" 
                      maxLength="6"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-iem-primary w-100 py-2 fw-bold mb-3">
                    Verify Code <i className="bi bi-check2-circle ms-1"></i>
                  </button>
                  <div className="text-center">
                    <button type="button" className="btn btn-link btn-sm text-decoration-none" onClick={() => setStep(1)}>
                      Change Email Address
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-iem-primary w-100 py-2 fw-bold mb-3">
                    Save New Password <i className="bi bi-lock-fill ms-1"></i>
                  </button>
                </form>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="text-center py-3">
                  <div className="text-success fs-1 mb-2">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <h5 className="fw-bold text-success mb-2">Password Changed Successfully!</h5>
                  <p className="text-muted small mb-4">
                    Your password has been updated. You can now log in using your new credentials.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-iem-primary w-100 py-2 fw-bold"
                    onClick={() => setCurrentPage('login')}
                  >
                    Go to Login <i className="bi bi-box-arrow-in-right ms-1"></i>
                  </button>
                </div>
              )}

              <div className="text-center small text-muted border-top pt-3 mt-3">
                Remember your password?{' '}
                <button 
                  type="button" 
                  className="btn btn-link p-0 fw-bold text-decoration-none"
                  onClick={() => setCurrentPage('login')}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
