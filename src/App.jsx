import { useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Dashboard from './pages/main/Dashboard'
import Layout from './layout/Layout'
import ApplyLoan from './pages/formPages/ApplyLoan'
import Login from './pages/auth/Login'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/apply-loan' element={<ApplyLoan />} />
          <Route path='*' element={<Navigate to="/"/>} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
