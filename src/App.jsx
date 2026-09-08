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
import Login from './pages/auth/Login'
import AllLoans from './pages/loan/AllLoans'
import AdvanceEMI from './pages/emi/AdvanceEMI'
import EMIDetails from './pages/emi/EMIDetails'
import DisbursementList from './pages/loan/DisbursementList'
import Dashboard2 from './pages/main/Dashboard2'
import NewLeads from './pages/leads/NewLeads'
import LeadDetails from './pages/leads/LeadDetails'
import CreditLeads from './pages/leads/CreditLeads'
import CreditDetails from './pages/leads/CreditDetails'
import DisbursementDetails from './pages/leads/DisbursementDetails'
import RejectedLeads from './pages/leads/RejectedLeads'
import KycLeads from './pages/leads/KycLeads'
import Kyc from './pages/leads/Kyc'
import LoanManagement from './pages/loan/LoanManagement'
// import CreateLoanProduct from './pages/master/LoanProductMaster'
import LoanProductMaster from './pages/master/LoanProductMaster'
import LeadCenter from './pages/leads/LeadCenter'
import DraftLeads from './pages/leads/DraftLeads'
import LeadDetailsOther from './pages/leads/LeadDetailsOther'
import LeadForm from './pages/formPages/LeadForm'
import DesignationMaster from './pages/master/DesignationMaster'
import PDQuestionsMaster from './pages/master/PDQuestionsMaster'
import PageMaster from './pages/master/PageMaster'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* <Route path='/' element={<Dashboard />} /> */}
          <Route path='/' element={<Dashboard2 />} />
          {/* emi */}
          <Route path='/advance-emi/' element={<AdvanceEMI />} />
          <Route path='/emi-details/' element={<EMIDetails />} />

          {/* master pages */}
          <Route path='/branches-master' element={<BranchList />} />
          <Route path='/finance-years-master' element={<FinantialYears />} />
          <Route path='/branch-managers-master' element={<BranchManagers />} />
          <Route path='/relationships-master' element={<Relationships />} />
          <Route path='/state-master' element={<StateList />} />
          <Route path='/city-master' element={<CityList />} />
          <Route path='/occupations-master' element={<Occupations />} /> 
          <Route path='/product-master' element={<LoanProductMaster />} /> 
          <Route path='/designation-master' element={<DesignationMaster />} /> 
          <Route path='/quetionare-master' element={<PDQuestionsMaster />} /> 
          <Route path='/page-master' element={<PageMaster />} /> 
          {/* <Route path='/product-master' element={<CreateLoanProduct />} />  */}

          {/* Leads Section  */}
          <Route path='/leads-draft' element={<DraftLeads />} />
          <Route path='/leads-new' element={<NewLeads />} />
          <Route path='/leads-assesment' element={<CreditLeads />} />
          <Route path='/leads-disbursement' element={<DisbursementList />} />
          <Route path='/leads-rejected' element={<RejectedLeads />} />
          <Route path='/leads-kyc' element={<KycLeads />} />

          {/* Loan Section  */}
          <Route path='/loan-all' element={<AllLoans />} />

          <Route path='/leads-detail' element={<LeadDetails />} />
          <Route path='/credit-detail' element={<CreditDetails />} />
          <Route path='/kyc-detail' element={<Kyc />} />
          <Route path='/disbursement-detail' element={<DisbursementDetails />} />

          <Route path='/all-leads' element={<LeadCenter />} />
          <Route path='/product-leads-detail' element={<LeadDetailsOther />} />
          
          <Route path='/loan-detail' element={<LoanManagement />} />
          

          <Route path='*' element={<Navigate to="/"/>} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
