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
import VendorMaster from './pages/master/VendorMaster'
import BusinessTradesMaster from './pages/master/BusinessTradesMaster'
import BankMaster from './pages/master/BankMaster'
import DepartmentMaster from './pages/master/DepartmentMaster'
import ClientLiveKYC from './components/common/ClientLiveKYC'
import DocumentMaster from './pages/master/DocumentMaster'
import TelecallingLeads from './pages/leads/TelecallingLeads'
import Telecalling from './pages/leads/Telecalling'
import BusinessTypeMaster from './pages/master/BusinessTypeMaster'
import EmployementTypeMaster from './pages/master/EmployementTypeMaster'
import SectorMaster from './pages/master/SectorMaster'
import ReligionMaster from './pages/master/ReligionMaster'
import GenderMaster from './pages/master/GenderMaster'
import ResidenceType from './pages/master/ResidenceType'
import LoanPurposeMaster from './pages/master/LoanPurposeMaster'
import ManageUser from './pages/admin/ManageUser'
import LeadSource from './pages/master/LeadSource'
import PageManagement from './pages/master/PageManagement'
import GroupManagement from './pages/master/GroupManagement'

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
          {/* <Route path='/branch-managers-master' element={<BranchManagers />} /> */}
          <Route path='/relationships-master' element={<Relationships />} />
          <Route path='/state-master' element={<StateList />} />
          <Route path='/city-master' element={<CityList />} />
          <Route path='/occupations-master' element={<Occupations />} /> 
          <Route path='/product-master' element={<LoanProductMaster />} /> 
          <Route path='/department-master' element={<DepartmentMaster />} /> 
          <Route path='/designation-master' element={<DesignationMaster />} /> 
          <Route path='/employement-type-master' element={<EmployementTypeMaster />} /> 
          <Route path='/sector-master' element={<SectorMaster />} /> 
          <Route path='/religion-master' element={<ReligionMaster />} /> 
          <Route path='/gender-master' element={<GenderMaster />} /> 
          <Route path='/residence-type-master' element={<ResidenceType />} /> 
          <Route path='/quetionare-master' element={<PDQuestionsMaster />} /> 
          <Route path='/vendor-master' element={<VendorMaster />} /> 
          <Route path='/business-trade-master' element={<BusinessTradesMaster />} /> 
          <Route path='/business-type-master' element={<BusinessTypeMaster />} /> 
          <Route path='/bank-master' element={<BankMaster />} /> 
          <Route path='/document-master' element={<DocumentMaster />} /> 
          <Route path='/loan-purpose-master' element={<LoanPurposeMaster />} /> 
          <Route path='/lead-source-master' element={<LeadSource />} /> 
          {/* <Route path='/product-master' element={<CreateLoanProduct />} />  */}

          {/* ADMIN */}
          <Route path='/manage-user' element={<ManageUser />} /> 
          <Route path='/manage-page' element={<PageManagement />} /> 
          <Route path='/manage-group' element={<GroupManagement />} /> 

          {/* Leads Section  */}
          <Route path='/leads-draft' element={<DraftLeads />} />
          <Route path='/leads-new' element={<NewLeads />} />
          <Route path='/leads-assesment' element={<CreditLeads />} />
          <Route path='/leads-disbursement' element={<DisbursementList />} />
          <Route path='/leads-rejected' element={<RejectedLeads />} />
          <Route path='/leads-kyc' element={<KycLeads />} />
          <Route path='/leads-telecalling' element={<TelecallingLeads />} />

          {/* Loan Section  */}
          <Route path='/loan-all' element={<AllLoans />} />

          <Route path='/leads-detail' element={<LeadDetails />} />
          <Route path='/credit-detail' element={<CreditDetails />} />
          <Route path='/kyc-detail' element={<Kyc />} />
          <Route path='/telecalling-detail' element={<Telecalling />} />
          <Route path='/disbursement-detail' element={<DisbursementDetails />} />

          <Route path='/all-leads' element={<LeadCenter />} />
          <Route path='/product-leads-detail' element={<LeadDetailsOther />} />
          
          <Route path='/loan-detail' element={<LoanManagement />} />
          
          <Route path='/loan-detail' element={<LoanManagement />} />
          

          <Route path='*' element={<Navigate to="/"/>} />
        </Route>
          <Route path='/login' element={<Login />} />
          {/* Client Pages */}
          <Route path='/client-kyc-page' element={<ClientLiveKYC />} />
      </Routes>
    </Router>
  )
}

export default App
