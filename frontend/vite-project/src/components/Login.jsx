import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/slices/auth.slice.js'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/auth.css'

const Login = () => {
  const dispatch = useDispatch()
  const { status, error } = useSelector(s => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      })
      .catch(()=>{})
  }

  return (
    <div className="auth-page gradient-bg">
      <div className="auth-card glass">
        <div className="auth-brand">
          <i className="fas fa-robot"></i>
          <h2>Nexus AI</h2>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={onSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="••••••••" required />
          </div>
          <button className="auth-btn" disabled={status==='loading'} type="submit">
            {status==='loading' ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        {error && <div className="auth-error"><i className="fas fa-triangle-exclamation"></i> {error}</div>}
        <div className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
