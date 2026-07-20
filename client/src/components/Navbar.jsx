import React from 'react';
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuToggle, title }) {
  const { user, theme, toggleTheme } = useAuth();

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--bg-surface-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 80
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
          className="mobile-menu-btn"
        >
          <Menu size={22} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
          {title || 'Dashboard'}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Icon */}
        <div style={{ position: 'relative' }}>
          <button
            title="Notifications"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Bell size={18} />
          </button>
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ef4444'
          }} />
        </div>

        {/* User Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.35rem 0.75rem 0.35rem 0.35rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)'
        }}>
          <img 
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff`} 
            alt={user?.name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name?.split(' ')[0] || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}
