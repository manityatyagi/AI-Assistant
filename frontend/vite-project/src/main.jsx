import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Loader from './components/ui/Loader.jsx'

// Route-level code splitting
const AppShell = lazy(() => import('./components/AppShell.jsx'))
const MessageArea = lazy(() => import('./components/MessageArea.jsx'))
const Login = lazy(() => import('./components/Login.jsx'))
const Register = lazy(() => import('./components/Register.jsx'))
const Tasks = lazy(() => import('./components/Tasks.jsx'))
const Schedule = lazy(() => import('./components/Schedule.jsx'))
const Finance = lazy(() => import('./components/Finance.jsx'))
const Health = lazy(() => import('./components/Health.jsx'))
const Settings = lazy(() => import('./components/Settings.jsx'))


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div style={{ padding: 20 }}><Loader label="Loading..." /></div>}>
          <Routes>
            <Route path='/' element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
            <Route path='/app' element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
            <Route path='/tasks' element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path='/schedule' element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
            <Route path='/finance' element={<ProtectedRoute><Finance /></ProtectedRoute>} />
            <Route path='/messages' element={<ProtectedRoute><MessageArea /></ProtectedRoute>} />
            <Route path='/chat' element={<ProtectedRoute><MessageArea /></ProtectedRoute>} />
            <Route path='/health' element={<ProtectedRoute><Health /></ProtectedRoute>} />
            <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
