import React, { useState } from 'react';

const HamburgerMenu = ({ menuItems, onLogout, onThemeSwitch, theme }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', zIndex: 200 }}>
      <button
        aria-label="Open menu"
        onClick={() => setOpen(!open)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 8,
          outline: 'none',
        }}
      >
        <div style={{ width: 30, height: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                height: 4,
                borderRadius: 2,
                background: theme === 'light' ? '#222' : '#FFD700',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 0,
            background: theme === 'light' ? '#fff' : '#181818',
            boxShadow: '0 2px 8px #0002',
            borderRadius: 12,
            padding: '1rem 1.5rem',
            minWidth: 180,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {menuItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              style={{
                color: theme === 'light' ? '#222' : '#FFD700',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 16,
                padding: '6px 0',
              }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button
            style={{
              background: theme === 'light' ? '#222' : '#FFD700',
              color: theme === 'light' ? '#FFD700' : '#222',
              border: 'none',
              borderRadius: 8,
              padding: '0.6rem 1.2rem',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
            }}
            onClick={() => {
              onThemeSwitch && onThemeSwitch();
              setOpen(false);
            }}
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          <button
            style={{
              background: '#c00',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.6rem 1.2rem',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
            }}
            onClick={() => {
              onLogout && onLogout();
              setOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
