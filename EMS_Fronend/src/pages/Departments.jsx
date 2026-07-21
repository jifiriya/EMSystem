import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  MapPin, 
  DollarSign, 
  UserCheck, 
  Edit3, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import DepartmentModal from '../components/DepartmentModal';

export default function Departments({ onMenuToggle }) {
  const { user } = useAuth();
  const isAdmin = ['Admin', 'HR Manager'].includes(user?.role);

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dept) => {
    setDepartmentToEdit(dept);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setDepartmentToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" department?`)) {
      try {
        await axios.delete(`/api/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting department');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Navbar onMenuToggle={onMenuToggle} title="Department Management" />

      <main className="page-container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Departments</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Organizational structure, headcounts, locations, and annual budgets
            </p>
          </div>

          {isAdmin && (
            <button className="btn btn-primary" onClick={handleCreate}>
              <PlusCircle size={18} />
              <span>Create Department</span>
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading departments...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {departments.map((dept) => (
              <div key={dept._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span className="badge badge-dept" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                        {dept.code}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{dept.name}</h3>
                    </div>

                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)',
                      background: 'var(--accent-light)', color: 'var(--accent-primary)',
                      fontSize: '0.8rem', fontWeight: 700
                    }}>
                      <Users size={14} />
                      <span>{dept.employeeCount} Members</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px', lineHeight: 1.5 }}>
                    {dept.description || 'No description provided for this department unit.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={16} style={{ color: 'var(--text-muted)' }} />
                      <span>Manager: <strong>{dept.managerName || 'Unassigned'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                      <span>Location: <strong>{dept.location || 'Headquarters'}</strong></span>
                    </div>

                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign size={16} style={{ color: 'var(--text-muted)' }} />
                        <span>Budget: <strong>${dept.budget ? dept.budget.toLocaleString() : '0'} / year</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  {isAdmin ? (
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(dept)} title="Edit Department">
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(dept._id, dept.name)} title="Delete Department">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : <div />}

                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/employees')}
                  >
                    <span>Employees</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isAdmin && (
        <DepartmentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchDepartments}
          departmentToEdit={departmentToEdit}
        />
      )}
    </div>
  );
}
