// import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
// import Dashboard from './pages/main/Dashboard'
// import Layout from './layout/Layout'
// import BranchList from './pages/master/BranchList'
// import FinantialYears from './pages/master/FinantialYears'
// import BranchManagers from './pages/master/BranchManagers'
// import Relationships from './pages/master/Relationships'
// import StateList from './pages/master/StateList'
// import CityList from './pages/master/CityList'
// import Occupations from './pages/master/Occupations'
// import Login from './pages/auth/Login'
// import AllLoans from './pages/loan/AllLoans'
// import AdvanceEMI from './pages/emi/AdvanceEMI'
// import EMIDetails from './pages/emi/EMIDetails'
// import DisbursementList from './pages/loan/DisbursementList'
// import Dashboard2 from './pages/main/Dashboard2'
// import NewLeads from './pages/leads/NewLeads'
// import LeadDetails from './pages/leads/LeadDetails'
// import CreditLeads from './pages/leads/CreditLeads'
// import CreditDetails from './pages/leads/CreditDetails'
// import DisbursementDetails from './pages/leads/DisbursementDetails'
// import RejectedLeads from './pages/leads/RejectedLeads'
// import KycLeads from './pages/leads/KycLeads'
// import Kyc from './pages/leads/Kyc'
// import LoanManagement from './pages/loan/LoanManagement'
// // import CreateLoanProduct from './pages/master/LoanProductMaster'
// import LoanProductMaster from './pages/master/LoanProductMaster'
// import LeadCenter from './pages/leads/LeadCenter'
// import DraftLeads from './pages/leads/DraftLeads'
// import LeadDetailsOther from './pages/leads/LeadDetailsOther'
// import LeadForm from './pages/formPages/LeadForm'
// import DesignationMaster from './pages/master/DesignationMaster'
// import PDQuestionsMaster from './pages/master/PDQuestionsMaster'
// import VendorMaster from './pages/master/VendorMaster'
// import BusinessTradesMaster from './pages/master/BusinessTradesMaster'
// import BankMaster from './pages/master/BankMaster'
// import DepartmentMaster from './pages/master/DepartmentMaster'
// import ClientLiveKYC from './components/common/ClientLiveKYC'
// import DocumentMaster from './pages/master/DocumentMaster'
// import TelecallingLeads from './pages/leads/TelecallingLeads'
// import Telecalling from './pages/leads/Telecalling'
// import BusinessTypeMaster from './pages/master/BusinessTypeMaster'
// import EmployementTypeMaster from './pages/master/EmployementTypeMaster'
// import SectorMaster from './pages/master/SectorMaster'
// import ReligionMaster from './pages/master/ReligionMaster'
// import GenderMaster from './pages/master/GenderMaster'
// import ResidenceType from './pages/master/ResidenceType'
// import LoanPurposeMaster from './pages/master/LoanPurposeMaster'
// import ManageUser from './pages/admin/ManageUser'
// import LeadSource from './pages/master/LeadSource'
// import PageManagement from './pages/master/PageManagement'
// import GroupManagement from './pages/master/GroupManagement'
// import LoanTypeMaster from './pages/master/LoanTypeMaster'
// import QuestionCategoryMaster from './pages/master/QuestionCategory'
// import TelecallerQuetionsMaster from './pages/master/TelecallerQuetionsMaster'
// import ManageRole from './pages/admin/ManageRole'
// import CasteMaster from './pages/master/CasteMaster'
// import LoanSubPurposeMaster from './pages/master/LoanSubPurposeMaster'
// import { AuthDataProvider, useAuthData } from './context/authContext'
// import RedirectPage from './pages/RedirectPage'
// import PagePermission from './pages/admin/PagePermission'

// function ProtectedRoute({ children }) {
//   const { isLoggedIn } = useAuthData();
//   return isLoggedIn ? children : <Navigate to="/login" replace />;
// }

// function GuestRoute({ children }) {
//   const { isLoggedIn } = useAuthData();
//   return isLoggedIn ? <Navigate to="/" replace /> : children;
// }

// function App() {

//   return (
//     <Router>
//       <AuthDataProvider>
//         <Routes>
//         <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
//           {/* <Route path='/' element={<Dashboard />} /> */}
//           <Route path='/' element={<Dashboard2 />} />
//           {/* emi */}
//           <Route path='/advance-emi/' element={<AdvanceEMI />} />
//           <Route path='/emi-details/' element={<EMIDetails />} />

//           {/* master pages */}
//           <Route path='/branches-master' element={<BranchList />} />
//           <Route path='/finance-years-master' element={<FinantialYears />} />
//           {/* <Route path='/branch-managers-master' element={<BranchManagers />} /> */}
//           <Route path='/relationships-master' element={<Relationships />} />
//           <Route path='/state-master' element={<StateList />} />
//           <Route path='/city-master' element={<CityList />} />
//           <Route path='/occupations-master' element={<Occupations />} /> 
//           <Route path='/product-master' element={<LoanProductMaster />} /> 
//           <Route path='/loan-type-master' element={<LoanTypeMaster />} /> 
//           <Route path='/department-master' element={<DepartmentMaster />} /> 
//           <Route path='/designation-master' element={<DesignationMaster />} /> 
//           <Route path='/employement-type-master' element={<EmployementTypeMaster />} /> 
//           <Route path='/sector-master' element={<SectorMaster />} /> 
//           <Route path='/religion-master' element={<ReligionMaster />} /> 
//           <Route path='/caste-master' element={<CasteMaster />} /> 
//           <Route path='/gender-master' element={<GenderMaster />} /> 
//           <Route path='/residence-type-master' element={<ResidenceType />} /> 
//           <Route path='/quetionare-master' element={<PDQuestionsMaster />} /> 
//           <Route path='/question-category' element={<QuestionCategoryMaster />} /> 
//           <Route path='/vendor-master' element={<VendorMaster />} /> 
//           <Route path='/business-trade-master' element={<BusinessTradesMaster />} /> 
//           <Route path='/business-type-master' element={<BusinessTypeMaster />} /> 
//           <Route path='/bank-master' element={<BankMaster />} /> 
//           <Route path='/document-master' element={<DocumentMaster />} /> 
//           <Route path='/loan-purpose-master' element={<LoanPurposeMaster />} /> 
//           <Route path='/loan-subpurpose-master' element={<LoanSubPurposeMaster />} /> 
//           <Route path='/lead-source-master' element={<LeadSource />} /> 
//           <Route path='/tellecaller-quetions-master' element={<TelecallerQuetionsMaster />} />
//           <Route path="/status" element={<RedirectPage />} /> 
//           {/* <Route path='/product-master' element={<CreateLoanProduct />} />  */}

//           {/* ADMIN */}
//           <Route path='/admin/manage-user' element={<ManageUser />} /> 
//           <Route path='/admin/manage-role' element={<ManageRole />} /> 
//           <Route path='/admin/manage-page' element={<PageManagement />} /> 
//           <Route path='/admin/manage-group' element={<GroupManagement />} /> 
//           <Route path='/admin/manage-permission' element={<PagePermission />} /> 

//           {/* Leads Section  */}
//           <Route path='/lead-management/leads-draft' element={<DraftLeads />} />
//           <Route path='/lead-management/leads-new' element={<NewLeads />} />
//           <Route path='/lead-management/leads-assesment' element={<CreditLeads />} />
//           <Route path='/lead-management/leads-disbursement' element={<DisbursementList />} />
//           <Route path='/lead-management/leads-rejected' element={<RejectedLeads />} />
//           <Route path='/lead-management/leads-kyc' element={<KycLeads />} />
//           <Route path='/lead-management/leads-telecalling' element={<TelecallingLeads />} />

//           {/* Loan Section  */}
//           <Route path='/loan-all' element={<AllLoans />} />

//           <Route path='/leads-detail' element={<LeadDetails />} />
//           <Route path='/credit-detail' element={<CreditDetails />} />
//           <Route path='/kyc-detail' element={<Kyc />} />
//           <Route path='/telecalling-detail' element={<Telecalling />} />
//           <Route path='/disbursement-detail' element={<DisbursementDetails />} />

//           <Route path='lead-center/all-leads' element={<LeadCenter />} />
//           <Route path='/product-leads-detail' element={<LeadDetailsOther />} />
          
//           <Route path='/loan-detail' element={<LoanManagement />} />
          
//           <Route path='/loan-detail' element={<LoanManagement />} />
          

//           <Route path='*' element={<Navigate to="/"/>} />
//         </Route>
//           <Route path='/login' element={<GuestRoute><Login /></GuestRoute>} />
//           {/* Client Pages */}
//           <Route path='/client-kyc-page' element={<ClientLiveKYC />} />
//         </Routes>
//       </AuthDataProvider>
//     </Router>
//   )
// }

// export default App






import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Layout from "./layout/Layout";
import BranchList from "./pages/master/BranchList";
import FinantialYears from "./pages/master/FinantialYears";
import Relationships from "./pages/master/Relationships";
import StateList from "./pages/master/StateList";
import CityList from "./pages/master/CityList";
import Occupations from "./pages/master/Occupations";

import Login from "./pages/auth/Login";
import AllLoans from "./pages/loan/AllLoans";
import AdvanceEMI from "./pages/emi/AdvanceEMI";
import EMIDetails from "./pages/emi/EMIDetails";
import DisbursementList from "./pages/loan/DisbursementList";
import Dashboard2 from "./pages/main/Dashboard2";

import NewLeads from "./pages/leads/NewLeads";
import LeadDetails from "./pages/leads/LeadDetails";
import CreditLeads from "./pages/leads/CreditLeads";
import CreditDetails from "./pages/leads/CreditDetails";
import DisbursementDetails from "./pages/leads/DisbursementDetails";
import RejectedLeads from "./pages/leads/RejectedLeads";
import KycLeads from "./pages/leads/KycLeads";
import Kyc from "./pages/leads/Kyc";
import LoanManagement from "./pages/loan/LoanManagement";

import LoanProductMaster from "./pages/master/LoanProductMaster";
import LeadCenter from "./pages/leads/LeadCenter";
import DraftLeads from "./pages/leads/DraftLeads";
import LeadDetailsOther from "./pages/leads/LeadDetailsOther";

import DesignationMaster from "./pages/master/DesignationMaster";
import PDQuestionsMaster from "./pages/master/PDQuestionsMaster";
import VendorMaster from "./pages/master/VendorMaster";
import BusinessTradesMaster from "./pages/master/BusinessTradesMaster";
import BankMaster from "./pages/master/BankMaster";
import DepartmentMaster from "./pages/master/DepartmentMaster";
import ClientLiveKYC from "./components/common/ClientLiveKYC";
import DocumentMaster from "./pages/master/DocumentMaster";
import TelecallingLeads from "./pages/leads/TelecallingLeads";
import Telecalling from "./pages/leads/Telecalling";
import BusinessTypeMaster from "./pages/master/BusinessTypeMaster";
import EmployementTypeMaster from "./pages/master/EmployementTypeMaster";
import SectorMaster from "./pages/master/SectorMaster";
import ReligionMaster from "./pages/master/ReligionMaster";
import GenderMaster from "./pages/master/GenderMaster";
import ResidenceType from "./pages/master/ResidenceType";
import LoanPurposeMaster from "./pages/master/LoanPurposeMaster";
import ManageUser from "./pages/admin/ManageUser";
import LeadSource from "./pages/master/LeadSource";
import PageManagement from "./pages/master/PageManagement";
import GroupManagement from "./pages/master/GroupManagement";
import LoanTypeMaster from "./pages/master/LoanTypeMaster";
import QuestionCategoryMaster from "./pages/master/QuestionCategory";
import TelecallerQuetionsMaster from "./pages/master/TelecallerQuetionsMaster";
import ManageRole from "./pages/admin/ManageRole";
import CasteMaster from "./pages/master/CasteMaster";
import LoanSubPurposeMaster from "./pages/master/LoanSubPurposeMaster";

import { AuthDataProvider, useAuthData } from "./context/authContext";
import RedirectPage from "./pages/RedirectPage";
import PagePermission from "./pages/admin/PagePermission";

// Normalize API URL and route URL
const normalizePath = (path = "") => {
  const cleanPath = `/${String(path).trim()}`
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");

  return cleanPath === "" ? "/" : cleanPath;
};

// Access denied page
function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Access Denied
      </h1>
      <p className="text-gray-500">
        You don't have permission to access this page.
      </p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthData();

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isLoggedIn } = useAuthData();

  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

// All application routes
const routeComponents = {
  "/advance-emi": AdvanceEMI,
  "/emi-details": EMIDetails,

  // Master pages
  "/master/branches-master": BranchList,
  "/master/finance-years-master": FinantialYears,
  "/master/relationships-master": Relationships,
  "/master/state-master": StateList,
  "/master/city-master": CityList,
  "/master/occupations-master": Occupations,
  "/master/product-master": LoanProductMaster,
  "/master/loan-type-master": LoanTypeMaster,
  "/master/department-master": DepartmentMaster,
  "/master/designation-master": DesignationMaster,
  "/master/employement-type-master": EmployementTypeMaster,
  "/master/sector-master": SectorMaster,
  "/master/religion-master": ReligionMaster,
  "/master/caste-master": CasteMaster,
  "/master/gender-master": GenderMaster,
  "/master/residence-type-master": ResidenceType,
  "/master/quetionare-master": PDQuestionsMaster,
  "/master/question-category": QuestionCategoryMaster,
  "/master/vendor-master": VendorMaster,
  "/master/business-trade-master": BusinessTradesMaster,
  "/master/business-type-master": BusinessTypeMaster,
  "/master/bank-master": BankMaster,
  "/master/document-master": DocumentMaster,
  "/master/loan-purpose-master": LoanPurposeMaster,
  "/master/loan-subpurpose-master": LoanSubPurposeMaster,
  "/master/lead-source-master": LeadSource,
  "/master/tellecaller-quetions-master": TelecallerQuetionsMaster,
  "/master/status": RedirectPage,

  // Admin
  "/admin/manage-user": ManageUser,
  "/admin/manage-role": ManageRole,
  "/admin/manage-page": PageManagement,
  "/admin/manage-group": GroupManagement,
  "/admin/manage-permission": PagePermission,

  // Leads
  "/lead-management/leads-draft": DraftLeads,
  "/lead-management/leads-new": NewLeads,
  "/lead-management/leads-assesment": CreditLeads,
  "/lead-management/leads-disbursement": DisbursementList,
  "/lead-management/leads-rejected": RejectedLeads,
  "/lead-management/leads-kyc": KycLeads,
  "/lead-management/leads-telecalling": TelecallingLeads,

  // Loan
  "/loan-all": AllLoans,
  "/loan-detail": LoanManagement,

  // Lead details
  "/leads-detail": LeadDetails,
  "/credit-detail": CreditDetails,
  "/kyc-detail": Kyc,
  "/telecalling-detail": Telecalling,
  "/disbursement-detail": DisbursementDetails,
  "/lead-center/all-leads": LeadCenter,
  "/product-leads-detail": LeadDetailsOther,
};

const noPermissionRequired = [
  "/admin/manage-permission",
  "/admin/manage-user",
  "/lead-center/all-leads",

  "/leads-detail",
  "/credit-detail",
  "/kyc-detail",
  "/telecalling-detail",
  "/disbursement-detail",
  "/product-leads-detail",
];

function AppRoutes() {
  const {
    isLoggedIn,
    permissions = [],
    permissionsLoading = false,
  } = useAuthData();

  // Support both grouped permissions and flat permission arrays
  const permissionList = Array.isArray(permissions)
    ? permissions.flatMap((group) =>
        Array.isArray(group?.loginpageNames)
          ? group.loginpageNames
          : [group]
      )
    : [];

  // Build allowed paths from API permissions
const allowedPaths = new Set(
  permissionList
    .filter((page) => {
      const hasReadPermission =
        typeof page?.read_permission_access === "boolean"
          ? page.read_permission_access
          : page?.set_permission_access === true;

      return hasReadPermission && page?.is_active !== false;
    })
    .map((page) => normalizePath(page?.page_url))
    .filter((path) => path !== "/")
);

  // Only routes having permission will be rendered
const accessiblePaths = Object.keys(routeComponents).filter((path) => {
  const normalizedPath = normalizePath(path);

  // In routes ko individual permission ki zarurat nahi
  if (noPermissionRequired.includes(normalizedPath)) {
    return true;
  }

  // Baaki routes ke liye API permission required
  return allowedPaths.has(normalizedPath);
});


  return (
    <Routes>
      {/* Protected application routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard permission is checked separately */}
        <Route
          path="/"
          element={
            permissionsLoading ? (
              <div className="p-6 text-center">Loading permissions...</div>
            ) : permissionList.some((page) => {
                const hasReadPermission =
                  typeof page?.read_permission_access === "boolean"
                    ? page.read_permission_access
                    : page?.set_permission_access === true;

                return (
                  normalizePath(page?.page_url) === "/" &&
                  hasReadPermission &&
                  page?.is_active !== false
                );
              }) ? (
              <Dashboard2 />
            ) : (
              <AccessDenied />
            )
          }
        />

        {/* Dynamic permission-based routes */}
        {!permissionsLoading &&
          accessiblePaths.map((path) => {
            const Component = routeComponents[path];

            return (
              <Route
                key={path}
                path={path}
                element={<Component />}
              />
            );
          })}

        {/* Unknown or unauthorized route */}
        <Route
          path="*"
          element={
            permissionsLoading ? (
              <div className="p-6 text-center">Loading permissions...</div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Route>

      {/* Guest route */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      {/* Public client KYC page */}
      <Route path="/client-kyc-page" element={<ClientLiveKYC />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthDataProvider>
        <AppRoutes />
      </AuthDataProvider>
    </Router>
  );
}

export default App;
