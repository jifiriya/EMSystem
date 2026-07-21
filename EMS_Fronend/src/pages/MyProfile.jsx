import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Mail, ShieldCheck, Sparkles, Key, Lock, Check, AlertCircle } from 'lucide-react';

export default function MyProfile({ onMenuToggle }) {
  const { user, updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await updatePassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(res.error);
    }
  };

  const isAdmin = ['Admin', 'HR Manager'].includes(user?.role);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Navbar onMenuToggle={onMenuToggle} title="My Account Profile" />

      <main className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* User Details Card */}
          <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <img 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff`}
                alt={user?.name}
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', border: '3px solid var(--accent-primary)' }}
              />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>{user?.name || 'User'}</h2>
              <span className="badge badge-dept" style={{ fontSize: '0.8rem' }}>{user?.role || 'Employee'}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={20} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
                  <strong style={{ fontSize: '0.95rem' }}>{user?.email}</strong>
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>System Role</span>
                  <strong style={{ fontSize: '0.95rem' }}>{user?.role}</strong>
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Access Level</span>
                  <strong style={{ fontSize: '0.95rem' }}>
                    {isAdmin ? 'Administrative Access (Full Management)' : 'Employee Standard Access'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Provision Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--accent-light)', color: 'var(--accent-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Key size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Update Password</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Change your password after initial login</span>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#16a34a', fontSize: '0.85rem', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <Check size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
