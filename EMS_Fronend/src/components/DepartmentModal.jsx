import React, { useState, useEffect } from 'react';
import { X, Building2, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function DepartmentModal({ isOpen, onClose, onSave, departmentToEdit = null }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    managerName: '',
    location: '',
    budget: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (departmentToEdit) {
        setFormData({
          name: departmentToEdit.name || '',
          code: departmentToEdit.code || '',
          description: departmentToEdit.description || '',
          managerName: departmentToEdit.managerName || '',
          location: departmentToEdit.location || '',
          budget: departmentToEdit.budget || ''
        });
      } else {
        setFormData({
          name: '',
          code: '',
          description: '',
          managerName: '',
          location: '',
          budget: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, departmentToEdit]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Department name is required';
    if (!formData.code.trim()) errs.code = 'Department code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (departmentToEdit) {
        await axios.put(`/api/departments/${departmentToEdit._id}`, formData);
      } else {
        await axios.post('/api/departments', formData);
      }
      onSave();
      onClose();
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Failed to save department details';
      setErrors({ server: serverMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '550px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--accent-light)', color: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Building2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                {departmentToEdit ? 'Edit Department' : 'Create New Department'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {departmentToEdit ? 'Modify department metadata and budget' : 'Add a new organizational unit'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
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
                <label className="form-label">Department Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Engineering"
                />
                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Dept Code *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. ENG"
                />
                {errors.code && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.code}</span>}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Manager Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.managerName}
                  onChange={e => setFormData({ ...formData, managerName: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Office Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Building A - Floor 4"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Annual Budget ($)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g. 500000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-textarea" 
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Overview of department focus and responsibilities..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : departmentToEdit ? 'Update Department' : 'Create Department'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
