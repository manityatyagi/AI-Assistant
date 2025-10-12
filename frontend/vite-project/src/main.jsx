 import { StrictMode } from 'react'
 import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import React, { Suspense, lazy } from 'react'
 import './index.css'
 import { Provider } from 'react-redux'
const App = lazy(() => import('./App.jsx'))
const Homepage = lazy(() => import('./components/Homepage.jsx'))
const MessageArea = lazy(() => import('./components/MessageArea.jsx'))
import store from './store/store'
import ErrorBoundary from './components/ErrorBoundary.jsx'
const Login = lazy(() => import('./components/Login.jsx'))
const Register = lazy(() => import('./components/Register.jsx'))
const Tasks = lazy(() => import('./components/Tasks.jsx'))
const Schedule = lazy(() => import('./components/Schedule.jsx'))
const AppShell = lazy(() => import('./components/AppShell.jsx'))
 import ProtectedRoute from './components/ProtectedRoute.jsx'
 import Finance from './components/Finance.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<div style={{ padding: 24 }}><span>Loading…</span></div>}>
            <Routes>
              <Route path='/' element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
              <Route path='/app' element={<ProtectedRoute><App /></ProtectedRoute>} />
              <Route path='/tasks' element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path='/schedule' element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
              <Route path='/finance' element={<ProtectedRoute><Finance /></ProtectedRoute>} />
              <Route path='/messages' element={<ProtectedRoute><MessageArea /></ProtectedRoute>} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/chat' element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
