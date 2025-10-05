 import { StrictMode } from 'react'
 import { createRoot } from 'react-dom/client'
 import { BrowserRouter, Route, Routes } from 'react-router-dom'
 import './index.css'
 import { Provider } from 'react-redux'
 import App from './App.jsx'
 import Homepage from './components/Homepage.jsx'
 import MessageArea from './components/MessageArea.jsx'
 import store from './store/store'
 import Login from './components/Login.jsx'
 import Register from './components/Register.jsx'
 import Tasks from './components/Tasks.jsx'
 import Schedule from './components/Schedule.jsx'
 import AppShell from './components/AppShell.jsx'
 import ProtectedRoute from './components/ProtectedRoute.jsx'
 import Finance from './components/Finance.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
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
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
