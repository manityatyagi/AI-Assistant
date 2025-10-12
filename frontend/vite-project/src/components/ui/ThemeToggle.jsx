import React, { useEffect, useState } from 'react';

const getInitialTheme = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
  if (stored === 'light' || stored === 'dark') return stored;
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <button
      aria-label="Toggle theme"
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
      style={{
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#cbd5e1',
        borderRadius: 10,
        padding: '6px 10px',
        cursor: 'pointer'
      }}
    >
      {isLight ? <i className="fas fa-moon" /> : <i className="fas fa-sun" />}
    </button>
  );
};

export default ThemeToggle;
