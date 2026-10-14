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
          <Route path='/master/branches' element={<BranchList />} />
          <Route path='/master/finance-years' element={<FinantialYears />} />
          {/* <Route path='/master/branch-managers' element={<BranchManagers />} /> */}
          <Route path='/master/relationships' element={<Relationships />} />
          <Route path='/master/state' element={<StateList />} />
          <Route path='/master/city' element={<CityList />} />
          <Route path='/master/occupations' element={<Occupations />} /> 
          <Route path='/master/product' element={<LoanProductMaster />} /> 
          <Route path='/master/department' element={<DepartmentMaster />} /> 
          <Route path='/master/designation' element={<DesignationMaster />} /> 
          <Route path='/master/employement-type' element={<EmployementTypeMaster />} /> 
          <Route path='/master/sector' element={<SectorMaster />} /> 
          <Route path='/master/religion' element={<ReligionMaster />} /> 
          <Route path='/master/gender' element={<GenderMaster />} /> 
          <Route path='/master/residence-type' element={<ResidenceType />} /> 
          <Route path='/master/quetionare' element={<PDQuestionsMaster />} /> 
          <Route path='/master/vendor' element={<VendorMaster />} /> 
          <Route path='/master/business-trade' element={<BusinessTradesMaster />} /> 
          <Route path='/master/business-type' element={<BusinessTypeMaster />} /> 
          <Route path='/master/bank' element={<BankMaster />} /> 
          <Route path='/master/document' element={<DocumentMaster />} /> 
          <Route path='/master/loan-purpose' element={<LoanPurposeMaster />} /> 
          <Route path='/master/lead-source' element={<LeadSource />} /> 
          {/* <Route path='/master/product' element={<CreateLoanProduct />} />  */}

          {/* ADMIN */}
          <Route path='/admin/manage-user' element={<ManageUser />} /> 
          <Route path='/admin/manage-page' element={<PageManagement />} /> 
          <Route path='/admin/manage-group' element={<GroupManagement />} /> 

          {/* Leads Section  */}
          <Route path='/lead-management/leads-draft' element={<DraftLeads />} />
          <Route path='/lead-management/leads-new' element={<NewLeads />} />
          <Route path='/lead-management/leads-assesment' element={<CreditLeads />} />
          <Route path='/lead-management/leads-disbursement' element={<DisbursementList />} />
          <Route path='/lead-management/leads-rejected' element={<RejectedLeads />} />
          <Route path='/lead-management/leads-kyc' element={<KycLeads />} />
          <Route path='/lead-management/leads-telecalling' element={<TelecallingLeads />} />

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
