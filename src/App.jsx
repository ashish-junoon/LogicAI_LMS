import { useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Dashboard from './pages/main/Dashboard'
import Layout from './layout/Layout'
import BranchList from './pages/master/BranchList'
import FinantialYears from './pages/master/FinantialYears'
import BranchManagers from './pages/master/BranchManagers'
import Relationships from './pages/master/Relationships'
import StateList from './pages/master/StateList'
import CityList from './pages/master/CityList'
import Occupations from './pages/master/Occupations'
import ApplyLoan from './pages/formPages/ApplyLoan'
import Login from './pages/auth/Login'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Dashboard />} />
          {/* master pages */}
          <Route path='/branches' element={<BranchList />} />
          <Route path='/finance-years' element={<FinantialYears />} />
          <Route path='/branch-managers' element={<BranchManagers />} />
          <Route path='/relationships' element={<Relationships />} />
          <Route path='/state-list' element={<StateList />} />
          <Route path='/city-list' element={<CityList />} />
          <Route path='/occupations' element={<Occupations />} />
          <Route path='/apply-loan' element={<ApplyLoan />} />
          <Route path='*' element={<Navigate to="/"/>} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
