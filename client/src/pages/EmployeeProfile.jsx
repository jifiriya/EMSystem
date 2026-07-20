import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Building2, 
  Edit3, 
  Trash2, 
  ShieldAlert
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import EmployeeModal from '../components/EmployeeModal';

export default function EmployeeProfile({ onMenuToggle }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ['Admin', 'HR Manager'].includes(user?.role);

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/employees/${id}`);
      setEmployee(res.data);
    } catch (err) {
      console.error('Error loading employee record', err);
      setError('Employee record not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await axios.delete(`/api/employees/${id}`);
        navigate('/employees');
      } catch (err) {
        alert('Failed to delete employee record');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Navbar onMenuToggle={onMenuToggle} title="Employee Profile" />
        <main className="page-container" style={{ textAlign: 'center', paddingTop: '4rem', color: 'var(--text-muted)' }}>
          Loading profile details...
        </main>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Navbar onMenuToggle={onMenuToggle} title="Employee Profile" />
        <main className="page-container">
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>{error || 'Employee record not found'}</h3>
            <button className="btn btn-primary" onClick={() => navigate('/employees')}>
              <ArrowLeft size={16} />
              <span>Back to Directory</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Navbar onMenuToggle={onMenuToggle} title="Employee Profile" />

      <main className="page-container">
        {/* Back navigation */}
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => navigate('/employees')}
          style={{ marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </button>

        {/* Hero Profile Header */}
        <div className="card" style={{
          padding: 0,
          overflow: 'hidden',
          marginBottom: '1.5rem',
          position: 'relative'
        }}>
          <div style={{
            height: '140px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)',
            position: 'relative'
          }} />

          <div style={{
            padding: '0 2rem 1.5rem',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '-50px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
              <img 
                src={employee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.firstName + ' ' + employee.lastName)}&background=4f46e5&color=fff`} 
                alt={`${employee.firstName} ${employee.lastName}`}
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid var(--bg-surface)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />

              <div style={{ paddingBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.5rem', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    {employee.employeeId}
                  </span>
                  <span className={`badge badge-${employee.status.toLowerCase().replace(' ', '')}`}>
                    {employee.status}
                  </span>
                </div>
                <p style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.05rem', margin: '0.25rem 0 0' }}>
                  {employee.role}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(true)}>
                  <Edit3 size={16} />
                  <span>Edit Profile</span>
                </button>
                <button className="btn btn-secondary" style={{ color: '#ef4444' }} onClick={handleDelete}>
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Contact & Personal Information */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Contact Information</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
                <span style={{ fontWeight: 600 }}>{employee.email}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phone Number</span>
                <span style={{ fontWeight: 600 }}>{employee.phone || 'Not provided'}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Joining Date</span>
                <span style={{ fontWeight: 600 }}>{new Date(employee.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Department & Job Information */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Organization & Role</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Department</span>
                <span className="badge badge-dept" style={{ marginTop: '0.25rem' }}>
                  {employee.department?.name || 'Unassigned'} ({employee.department?.code || 'N/A'})
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Office Location</span>
                <span style={{ fontWeight: 600 }}>{employee.department?.location || 'Main Headquarters'}</span>
              </div>

              {isAdmin && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Annual Compensation</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                    ${employee.salary?.toLocaleString()} / year
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact & Bio */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} style={{ color: '#ef4444' }} />
              <span>Emergency Contact & Notes</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Emergency Contact Person</h4>
                <div style={{ fontSize: '0.875rem' }}>
                  <div><strong>Name:</strong> {employee.emergencyContact?.name || 'Not provided'}</div>
                  <div><strong>Relation:</strong> {employee.emergencyContact?.relation || 'N/A'}</div>
                  <div><strong>Phone:</strong> {employee.emergencyContact?.phone || 'N/A'}</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Professional Summary / Bio</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {employee.bio || 'No background bio notes provided for this employee profile.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal (Admin Only) */}
      {isAdmin && (
        <EmployeeModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={fetchEmployeeDetails}
          employeeToEdit={employee}
        />
      )}
    </div>
  );
}
