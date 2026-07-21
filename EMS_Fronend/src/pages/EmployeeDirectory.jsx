import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  Grid, 
  List, 
  Mail, 
  Phone, 
  Building2, 
  Edit3, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import EmployeeModal from '../components/EmployeeModal';

export default function EmployeeDirectory({ onMenuToggle }) {
  const { user } = useAuth();
  const isAdmin = ['Admin', 'HR Manager'].includes(user?.role);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const navigate = useNavigate();

  // Debounce search query input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearchQuery, selectedDept, selectedStatus, page]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments', err);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        q: debouncedSearchQuery,
        department: selectedDept,
        status: selectedStatus,
        page,
        limit: 12
      };
      const res = await axios.get('/api/employees', { params });
      setEmployees(res.data.employees);
      setTotalPages(res.data.pages);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error('Error fetching employee list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the employee directory?`)) {
      try {
        await axios.delete(`/api/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting employee record');
      }
    }
  };

  const handleEdit = (emp) => {
    setEmployeeToEdit(emp);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-active">Active</span>;
      case 'On Leave':
        return <span className="badge badge-leave">On Leave</span>;
      case 'Inactive':
        return <span className="badge badge-inactive">Inactive</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Navbar onMenuToggle={onMenuToggle} title="Employee Directory" />

      <main className="page-container">
        {/* Header Title + Action Button (Admin Only) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Employee Directory</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              {isAdmin ? 'Search, filter, and manage staff members' : 'View company teammates and profiles'} ({totalRecords} total employees)
            </p>
          </div>

          {isAdmin && (
            <button className="btn btn-primary" onClick={handleCreate}>
              <UserPlus size={18} />
              <span>Add Employee</span>
            </button>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Search input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search by name, role, email, or employee ID..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>

            {/* Department Dropdown Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '200px' }}>
              <Building2 size={18} style={{ color: 'var(--text-muted)' }} />
              <select 
                className="form-select"
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setPage(1); }}
              >
                <option value="all">All Departments</option>
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Status Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--bg-primary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              {['all', 'Active', 'On Leave', 'Inactive'].map((st) => (
                <button
                  key={st}
                  onClick={() => { setSelectedStatus(st); setPage(1); }}
                  style={{
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: selectedStatus === st ? 'var(--accent-primary)' : 'transparent',
                    color: selectedStatus === st ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'var(--transition)'
                  }}
                >
                  {st === 'all' ? 'All Status' : st}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div style={{ display: 'flex', gap: '0.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
              <button 
                onClick={() => setViewMode('grid')}
                title="Grid View"
                style={{
                  padding: '0.375rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
                  backgroundColor: viewMode === 'grid' ? 'var(--accent-light)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-muted)'
                }}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                title="List View"
                style={{
                  padding: '0.375rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
                  backgroundColor: viewMode === 'list' ? 'var(--accent-light)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--text-muted)'
                }}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Directory Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading employee directory...
          </div>
        ) : employees.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Employees Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              No employee matches your current search term or filter criteria. Try adjusting your query or reset filters.
            </p>
            <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setSelectedDept('all'); setSelectedStatus('all'); }}>
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Layout */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {employees.map((emp) => (
              <div key={emp._id} className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    {emp.employeeId}
                  </span>
                  {getStatusBadge(emp.status)}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <img 
                    src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=4f46e5&color=fff`} 
                    alt={`${emp.firstName} ${emp.lastName}`}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-light)', margin: '0 auto 0.75rem' }}
                  />
                  <h3 
                    onClick={() => navigate(`/employees/${emp._id}`)}
                    style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem', cursor: 'pointer' }}
                    className="hover-underline"
                  >
                    {emp.firstName} {emp.lastName}
                  </h3>
                  <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                    {emp.role}
                  </p>
                  <span className="badge badge-dept" style={{ marginTop: '0.5rem' }}>
                    {emp.department?.name || 'Department'}
                  </span>
                </div>

                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  marginTop: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.825rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    style={{ flex: 1 }}
                    onClick={() => navigate(`/employees/${emp._id}`)}
                  >
                    <Eye size={14} />
                    <span>Profile</span>
                  </button>
                  {isAdmin && (
                    <>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => handleEdit(emp)}
                        title="Edit Record"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ color: '#ef4444' }}
                        onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)}
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View Table */
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Employee</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>ID</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Department</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Role</th>
                    <th style={{ padding: '1rem', fontWeight: 700 }}>Status</th>
                    {isAdmin && <th style={{ padding: '1rem', fontWeight: 700 }}>Salary</th>}
                    <th style={{ padding: '1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=4f46e5&color=fff`} 
                            alt={emp.firstName}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div 
                              onClick={() => navigate(`/employees/${emp._id}`)}
                              style={{ fontWeight: 600, cursor: 'pointer' }}
                            >
                              {emp.firstName} {emp.lastName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>{emp.employeeId}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-dept">{emp.department?.name || 'Unassigned'}</span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{emp.role}</td>
                      <td style={{ padding: '1rem' }}>{getStatusBadge(emp.status)}</td>
                      {isAdmin && <td style={{ padding: '1rem', fontWeight: 600 }}>${emp.salary?.toLocaleString()}/yr</td>}
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/employees/${emp._id}`)} title="View Profile">
                            <Eye size={14} />
                          </button>
                          {isAdmin && (
                            <>
                              <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(emp)} title="Edit Record">
                                <Edit3 size={14} />
                              </button>
                              <button className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)} title="Delete Record">
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              className="btn btn-secondary btn-sm"
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Page {page} of {totalPages}
            </span>
            <button 
              className="btn btn-secondary btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      {/* Add / Edit Modal (Admin Only) */}
      {isAdmin && (
        <EmployeeModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchEmployees}
          employeeToEdit={employeeToEdit}
        />
      )}
    </div>
  );
}
