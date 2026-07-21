import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function EmployeeModal({ isOpen, onClose, onSave, employeeToEdit = null }) {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    salary: '',
    avatar: '',
    bio: '',
    emergencyContact: { name: '', phone: '', relation: '' }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      if (employeeToEdit) {
        setFormData({
          firstName: employeeToEdit.firstName || '',
          lastName: employeeToEdit.lastName || '',
          email: employeeToEdit.email || '',
          phone: employeeToEdit.phone || '',
          role: employeeToEdit.role || '',
          department: employeeToEdit.department?._id || employeeToEdit.department || '',
          status: employeeToEdit.status || 'Active',
          joinDate: employeeToEdit.joinDate ? new Date(employeeToEdit.joinDate).toISOString().split('T')[0] : '',
          salary: employeeToEdit.salary || '',
          avatar: employeeToEdit.avatar || '',
          bio: employeeToEdit.bio || '',
          emergencyContact: {
            name: employeeToEdit.emergencyContact?.name || '',
            phone: employeeToEdit.emergencyContact?.phone || '',
            relation: employeeToEdit.emergencyContact?.relation || ''
          }
        });
      } else {
        // Reset form for creation
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: '',
          department: '',
          status: 'Active',
          joinDate: new Date().toISOString().split('T')[0],
          salary: '',
          avatar: '',
          bio: '',
          emergencyContact: { name: '', phone: '', relation: '' }
        });
      }
      setErrors({});
    }
  }, [isOpen, employeeToEdit]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
      if (!employeeToEdit && res.data.length > 0) {
        setFormData(prev => ({ ...prev, department: prev.department || res.data[0]._id }));
      }
    } catch (err) {
      console.error('Error loading departments', err);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email address';
    }
    if (!formData.role.trim()) errs.role = 'Role / Job title is required';
    if (!formData.department) errs.department = 'Please select a department';
    if (!formData.salary || isNaN(formData.salary) || Number(formData.salary) <= 0) {
      errs.salary = 'Valid annual salary is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (employeeToEdit) {
        await axios.put(`/api/employees/${employeeToEdit._id}`, formData);
      } else {
        await axios.post('/api/employees', formData);
      }
      onSave();
      onClose();
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Error saving employee details';
      setErrors({ server: serverMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--accent-light)', color: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                {employeeToEdit ? 'Edit Employee Details' : 'Add New Employee'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {employeeToEdit ? 'Update employee record and role details' : 'Enter details to register a new staff member'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.server && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.85rem',
                marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{errors.server}</span>
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Alex"
                />
                {errors.firstName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Rivera"
                />
                {errors.lastName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex.rivera@company.com"
                />
                {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Job Title / Role *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                />
                {errors.role && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.role}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select 
                  className="form-select"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                  ))}
                </select>
                {errors.department && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.department}</span>}
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select 
                  className="form-select"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.joinDate}
                  onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Salary ($) *</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="105000"
                />
                {errors.salary && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.salary}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Image URL (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.avatar}
                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Summary</label>
              <textarea 
                className="form-textarea" 
                rows={2}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief professional background description..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : employeeToEdit ? 'Update Employee' : 'Add Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
