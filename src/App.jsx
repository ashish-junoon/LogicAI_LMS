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
import AllLoans from './pages/loan/AllLoans'
import AdvanceEMI from './pages/emi/AdvanceEMI'
import EMIDetails from './pages/emi/EMIDetails'
import LoanApproval from './pages/loan/LoanApproval'
import Loan from './pages/loan/Loan'
import DisbursementList from './pages/loan/DisbursementList'
import Dashboard2 from './pages/main/Dashboard2'
import PendingLeads from './pages/leads/PendingLeads'
import NewLeads from './pages/leads/NewLeads'
import LeadDetails from './pages/leads/LeadDetails'
import CreditLeads from './pages/leads/CreditLeads'
import CreditDetails from './pages/leads/CreditDetails'
import DisbursementDetails from './pages/leads/DisbursementDetails'
import RejectedLeads from './pages/leads/RejectedLeads'
import KycLeads from './pages/leads/KycLeads'
import Kyc from './pages/leads/Kyc'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Dashboard2 />} />
          {/* emi */}
          <Route path='/advance-emi/' element={<AdvanceEMI />} />
          <Route path='/emi-details/' element={<EMIDetails />} />

          {/* master pages */}
          <Route path='/branches' element={<BranchList />} />
          <Route path='/finance-years' element={<FinantialYears />} />
          <Route path='/branch-managers' element={<BranchManagers />} />
          <Route path='/relationships' element={<Relationships />} />
          <Route path='/state-list' element={<StateList />} />
          <Route path='/city-list' element={<CityList />} />
          <Route path='/occupations' element={<Occupations />} /> 

          {/* <Route path='/apply-loan' element={<ApplyLoan />} /> */}

          {/* Leads Section  */}
          <Route path='/leads-pending' element={<PendingLeads />} />
          <Route path='/leads-new' element={<NewLeads />} />
          <Route path='/leads-assesment' element={<CreditLeads />} />
          <Route path='/leads-disbursement' element={<DisbursementList />} />
          <Route path='/leads-rejected' element={<RejectedLeads />} />
          <Route path='/leads-kyc' element={<KycLeads />} />

          <Route path='/leads-detail' element={<LeadDetails />} />
          <Route path='/credit-detail' element={<CreditDetails />} />
          <Route path='/disbursement-detail' element={<DisbursementDetails />} />
          <Route path='/kyc-detail' element={<Kyc />} />
          
          <Route path='/all-loans' element={<AllLoans />} />
          {/* Has to remove */}
          <Route path='/loan-info' element={<Loan />} />
          <Route path='/loan-approval' element={<LoanApproval />} />

          <Route path='*' element={<Navigate to="/"/>} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
