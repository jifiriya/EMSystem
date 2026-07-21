import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Building2, 
  DollarSign, 
  UserPlus, 
  PlusCircle, 
  ChevronRight,
  TrendingUp,
  Briefcase,
  User,
  Mail,
  ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import EmployeeModal from '../components/EmployeeModal';
import DepartmentModal from '../components/DepartmentModal';

export default function Dashboard({ onMenuToggle }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  const navigate = useNavigate();
  const isAdmin = ['Admin', 'HR Manager'].includes(user?.role);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get('/api/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Navbar onMenuToggle={onMenuToggle} title={isAdmin ? "Executive HR Dashboard" : "Employee Workspace Portal"} />

      <main className="page-container">
        {/* Welcome Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              {isAdmin ? 'System Overview' : `Welcome Back, ${user?.name || 'Team Member'}`}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
              {isAdmin 
                ? 'Live workforce metrics and department distribution overview'
                : `Signed in as ${user?.role || 'Employee'} · ${user?.email}`
              }
            </p>
          </div>

          {/* Quick Action buttons strictly for Admin / HR Manager */}
          {isAdmin && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setIsDeptModalOpen(true)}>
                <PlusCircle size={18} />
                <span>Add Department</span>
              </button>
              <button className="btn btn-primary" onClick={() => setIsEmpModalOpen(true)}>
                <UserPlus size={18} />
                <span>Add Employee</span>
              </button>
            </div>
          )}
        </div>

        {/* ADMIN DASHBOARD VIEW */}
        {isAdmin ? (
          <>
            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              {/* Total Employees */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Headcount</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0' }}>
                      {loading ? '...' : stats?.metrics?.totalEmployees || 0}
                    </h3>
                  </div>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'var(--accent-light)', color: 'var(--accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Users size={22} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '1rem', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                  <TrendingUp size={14} />
                  <span>Active workforce record</span>
                </div>
              </div>

              {/* Active Status */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Employees</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0', color: '#16a34a' }}>
                      {loading ? '...' : stats?.metrics?.activeEmployees || 0}
                    </h3>
                  </div>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.15)', color: '#16a34a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <UserCheck size={22} />
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                  Currently on active duty
                </div>
              </div>

              {/* On Leave */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>On Leave</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0', color: '#d97706' }}>
                      {loading ? '...' : stats?.metrics?.onLeaveEmployees || 0}
                    </h3>
                  </div>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.15)', color: '#d97706',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <UserMinus size={22} />
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                  Planned absence / sick leave
                </div>
              </div>

              {/* Total Departments */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Departments</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0' }}>
                      {loading ? '...' : stats?.metrics?.totalDepartments || 0}
                    </h3>
                  </div>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(14, 165, 233, 0.15)', color: '#0284c7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Building2 size={22} />
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                  Active business units
                </div>
              </div>

              {/* Annual Payroll */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Annual Payroll</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0', color: 'var(--accent-primary)' }}>
                      {loading ? '...' : formatCurrency(stats?.metrics?.totalSalary)}
                    </h3>
                  </div>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <DollarSign size={22} />
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                  Total compensation commitment
                </div>
              </div>
            </div>

            {/* Department Breakdown & Recent Activity */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Department Distribution */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Department Distribution</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Staffing ratio by business unit</span>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/departments')}
                  >
                    <span>View All</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {stats?.departmentDistribution?.map((dept) => (
                    <div key={dept.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                        <span style={{ fontWeight: 600 }}>{dept.name} ({dept.code})</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                          {dept.employeeCount} employee(s) · <strong style={{ color: 'var(--accent-primary)' }}>{dept.percentage}%</strong>
                        </span>
                      </div>
                      <div style={{
                        width: '100%', height: '8px', borderRadius: '4px',
                        backgroundColor: 'var(--border-color)', overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${dept.percentage}%`,
                          height: '100%',
                          borderRadius: '4px',
                          background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
                          transition: 'width 0.5s ease-out'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Hires */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Additions</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Newly onboarded team members</span>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/employees')}
                  >
                    <span>Directory</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats?.recentHires?.map((emp) => (
                    <div 
                      key={emp._id}
                      onClick={() => navigate(`/employees/${emp._id}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-primary)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=4f46e5&color=fff`} 
                          alt={emp.firstName}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {emp.role}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-dept" style={{ fontSize: '0.7rem' }}>
                          {emp.department?.code || 'DEPT'}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {new Date(emp.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* EMPLOYEE DASHBOARD VIEW */
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Employee Quick Profile Card */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <img 
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff`} 
                      alt={user?.name}
                      style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{user?.name}</h3>
                      <span className="badge badge-dept" style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'inline-block' }}>
                        {user?.role || 'Employee'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <Mail size={16} />
                      <span>{user?.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <ShieldCheck size={16} />
                      <span>Standard Access Portal</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '1.5rem' }}
                  onClick={() => navigate('/profile')}
                >
                  <User size={16} />
                  <span>My Profile & Security</span>
                </button>
              </div>

              {/* Company Metrics Card */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem', fontWeight: 700 }}>Company Directory Overview</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Teammates</span>
                      <h4 style={{ fontSize: '1.75rem', margin: '0.25rem 0 0', color: 'var(--accent-primary)' }}>
                        {loading ? '...' : stats?.metrics?.totalEmployees || 0}
                      </h4>
                    </div>

                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Departments</span>
                      <h4 style={{ fontSize: '1.75rem', margin: '0.25rem 0 0', color: '#0284c7' }}>
                        {loading ? '...' : stats?.metrics?.totalDepartments || 0}
                      </h4>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => navigate('/employees')}
                >
                  <Users size={16} />
                  <span>Explore Employee Directory</span>
                </button>
              </div>
            </div>

            {/* Team Directory Preview */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Company Directory Highlights</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Find and connect with your colleagues</span>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate('/employees')}
                >
                  <span>View All</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {stats?.recentHires?.map((emp) => (
                  <div 
                    key={emp._id}
                    onClick={() => navigate(`/employees/${emp._id}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <img 
                      src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=4f46e5&color=fff`} 
                      alt={emp.firstName}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {emp.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals for Admin */}
      {isAdmin && (
        <>
          <EmployeeModal 
            isOpen={isEmpModalOpen} 
            onClose={() => setIsEmpModalOpen(false)} 
            onSave={fetchDashboardStats} 
          />
          <DepartmentModal 
            isOpen={isDeptModalOpen} 
            onClose={() => setIsDeptModalOpen(false)} 
            onSave={fetchDashboardStats} 
          />
        </>
      )}
    </div>
  );
}
