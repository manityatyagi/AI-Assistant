import React, { useEffect, useState } from 'react'

const Settings = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="nx-container" style={{ paddingTop: 24 }}>
      <main className="nx-main">
        <section className="nx-welcome">
          <h1>Settings</h1>
          <p>Personalize your experience.</p>
        </section>

        <section className="nx-grid">
          <div className="nx-card">
            <div className="nx-card-header"><div className="nx-card-title">Theme</div></div>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={()=>setTheme('dark')} className={`nx-pill ${theme==='dark'?'active':''}`}><i className="fas fa-moon"/> Dark</button>
              <button onClick={()=>setTheme('light')} className={`nx-pill ${theme==='light'?'active':''}`}><i className="fas fa-sun"/> Light</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Settings
