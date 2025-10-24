import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/auth.slice.js'
import '../styles/dashboard.css'

const AppShell = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user, token } = useSelector(s => s.auth)
  useEffect(() => {
    document.body.classList.add('nexus')
    return () => document.body.classList.remove('nexus')
  }, [])

  const isActive = (path) => location.pathname === path

  const onLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div>
      <header className="nx-header">
        <div className="nx-logo">
          <i className="fas fa-robot"></i>
          <span>Nexus AI</span>
        </div>
        <div className="nx-user">
          {token ? (
            <>
              <div className="nx-avatar">{(user?.name || 'U').slice(0,2).toUpperCase()}</div>
              <div>{user?.name || 'You'}</div>
              <button onClick={onLogout} className="nx-pill" style={{ border:'1px solid rgba(255,255,255,.15)' }}>
                <i className="fas fa-right-from-bracket"></i> Logout
              </button>
            </>
          ) : (
            <div style={{fontSize:'.9rem', opacity:.8}}>Guest</div>
          )}
        </div>
      </header>

      <div className="nx-topnav">
        <div className="nx-pills">
          <div className={`nx-pill ${isActive('/') ? 'active' : ''}`} onClick={()=>navigate('/') }><i className="fas fa-home"></i>Dashboard</div>
          <div className={`nx-pill ${isActive('/tasks') ? 'active' : ''}`} onClick={()=>navigate('/tasks')}><i className="fas fa-tasks"></i>Tasks & Productivity</div>
          <div className={`nx-pill ${isActive('/schedule') ? 'active' : ''}`} onClick={()=>navigate('/schedule')}><i className="fas fa-calendar-alt"></i>Schedule</div>
          <div className={`nx-pill ${isActive('/health') ? 'active' : ''}`} onClick={()=>navigate('/health')}><i className="fas fa-heartbeat"></i>Health & Wellness</div>
          <div className={`nx-pill ${isActive('/finance') ? 'active' : ''}`} onClick={()=>navigate('/finance')}><i className="fas fa-wallet"></i>Finance</div>
          <div className={`nx-pill ${isActive('/settings') ? 'active' : ''}`} onClick={()=>navigate('/settings')}><i className="fas fa-cog"></i>Settings</div>
        </div>
      </div>

      <div className="nx-container">
        <main className="nx-main" style={{width:'100%'}}>
          <section className="nx-welcome">
            <h1>{token ? `Good morning, ${user?.name?.split(' ')[0] || 'there'}!` : 'Welcome to Nexus AI'}</h1>
            <p>
              {token
                ? "Your AI assistant has optimized your day."
                : "Sign in to unlock personalized tasks, schedule, and calendar widgets."}
            </p>
            <div className="nx-actions">
              <div className="nx-action" onClick={()=>navigate('/tasks')}><i className="fas fa-plus"></i><span>Add Task</span></div>
              <div className="nx-action" onClick={()=>navigate('/schedule')}><i className="fas fa-calendar-plus"></i><span>Schedule Event</span></div>
              <div className="nx-action" onClick={()=>navigate('/health')}><i className="fas fa-utensils"></i><span>Plan Meals</span></div>
              <div className="nx-action" onClick={()=>navigate('/health')}><i className="fas fa-running"></i><span>Workout Plan</span></div>
            </div>
          </section>

          {token && (
          <section className="nx-grid nx-row-3">
            <div className="nx-card">
              <div className="nx-card-header"><div className="nx-card-title">Today's Tasks</div><i className="fas fa-ellipsis-h"></i></div>
              <div className="nx-task-list">
                <div className="nx-task"><input type="checkbox" defaultChecked/><div className="nx-task-text nx-task-completed">Morning meditation</div><i className="fas fa-bell"></i></div>
                <div className="nx-task"><input type="checkbox"/><div className="nx-task-text">Team meeting at 10:00 AM</div><i className="fas fa-bell"></i></div>
                <div className="nx-task"><input type="checkbox"/><div className="nx-task-text">Finish project proposal</div><i className="fas fa-bell"></i></div>
                <div className="nx-task"><input type="checkbox"/><div className="nx-task-text">Gym session</div><i className="fas fa-bell"></i></div>
                <div className="nx-task"><input type="checkbox"/><div className="nx-task-text">Grocery shopping</div><i className="fas fa-bell"></i></div>
              </div>
            </div>

            <div className="nx-card nx-card--lightblue">
              <div className="nx-card-header"><div className="nx-card-title">Calendar</div><i className="fas fa-ellipsis-h"></i></div>
              <div className="nx-cal-grid">
                <div className="nx-cal-day other">28</div>
                <div className="nx-cal-day other">29</div>
                <div className="nx-cal-day other">30</div>
                <div className="nx-cal-day">1</div>
                <div className="nx-cal-day">2</div>
                <div className="nx-cal-day">3</div>
                <div className="nx-cal-day">4</div>
                <div className="nx-cal-day">5</div>
                <div className="nx-cal-day">6</div>
                <div className="nx-cal-day">7</div>
                <div className="nx-cal-day today">8</div>
                <div className="nx-cal-day has-event">9</div>
                <div className="nx-cal-day">10</div>
                <div className="nx-cal-day">11</div>
                <div className="nx-cal-day">12</div>
                <div className="nx-cal-day">13</div>
                <div className="nx-cal-day">14</div>
                <div className="nx-cal-day has-event">15</div>
                <div className="nx-cal-day">16</div>
                <div className="nx-cal-day">17</div>
                <div className="nx-cal-day">18</div>
                <div className="nx-cal-day">19</div>
                <div className="nx-cal-day">20</div>
                <div className="nx-cal-day">21</div>
                <div className="nx-cal-day">22</div>
                <div className="nx-cal-day">23</div>
                <div className="nx-cal-day">24</div>
                <div className="nx-cal-day">25</div>
                <div className="nx-cal-day">26</div>
                <div className="nx-cal-day">27</div>
                <div className="nx-cal-day">28</div>
                <div className="nx-cal-day">29</div>
                <div className="nx-cal-day">30</div>
                <div className="nx-cal-day other">1</div>
              </div>
            </div>

            <div className="nx-card nx-card--lightblue">
              <div className="nx-card-header"><div className="nx-card-title">Health & Wellness</div><i className="fas fa-ellipsis-h"></i></div>
              <div className="nx-stats">
                <div className="nx-stat"><span>Sleep</span><div className="nx-bar"><div className="nx-fill nx-sleep"></div></div><span>7h 30m</span></div>
                <div className="nx-stat"><span>Steps</span><div className="nx-bar"><div className="nx-fill nx-steps"></div></div><span>6,842/10,000</span></div>
                <div className="nx-stat"><span>Hydration</span><div className="nx-bar"><div className="nx-fill nx-hydr"></div></div><span>1.2L/2.5L</span></div>
              </div>
            </div>
          </section>
          )}
        </main>
      </div>

      <section className="nx-container" style={{paddingTop:0}}>
        <div className="nx-chat nx-chat--lightblue nx-chat--fullwidth">
          <div className="nx-chat-head">
            <div className="nx-ai"><i className="fas fa-robot"></i></div>
            <div>
              <div>Nexus Assistant</div>
              <div style={{fontSize:'.8rem', color:'var(--gray)'}}>Online</div>
            </div>
          </div>
          <div className="nx-chat-msgs">
            <div className="nx-msg ai">Good morning, John! I've optimized your schedule for today. Would you like me to brief you on the key items?</div>
            <div className="nx-msg user">Yes, please. What's my most important task today?</div>
            <div className="nx-msg ai">Your project proposal is the priority. I've blocked 2-4 PM for focused work.</div>
          </div>
          <div className="nx-chat-input">
            <input placeholder="Message Nexus Assistant..." />
            <button className="nx-send"><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </section>

      <footer className="nx-footer">
        <p>Nexus AI Assistant</p>
      </footer>
    </div>
  )
}

export default AppShell