import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../store/slices/auth.slice.js'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

const Register = () => {
  const dispatch = useDispatch()
  const { status, error } = useSelector(s => s.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => navigate('/login'))
      .catch(()=>{})
  }

  return (
    <div className="auth-page gradient-bg">
      <div className="auth-card glass">
        <div className="auth-brand">
          <i className="fas fa-user-plus"></i>
          <h2>Create account</h2>
          <p>Join Nexus AI to unlock your personal dashboard</p>
        </div>
        <form onSubmit={onSubmit} className="auth-form">
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="••••••••" required />
          </div>
          <button className="auth-btn" disabled={status==='loading'} type="submit">
            {status==='loading' ? 'Creating…' : 'Create Account'}
          </button>
        </form>
        {error && <div className="auth-error"><i className="fas fa-triangle-exclamation"></i> {error}</div>}
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
