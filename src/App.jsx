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
import { useEffect, useState } from "react";
import RateLimitPage from "./pages/auth/RateLimitPage";
import AccessDenied from "./pages/auth/AccessDenied";
import Loader from "./components/utils/Loader";
import CollectionDetails from "./pages/emi/CollectionDetails";
import Profile from "./pages/auth/Profile";
import ZoneMaster from "./pages/master/ZoneMaster";
import RegionMaster from "./pages/master/RegionMaster";
import AreaMaster from "./pages/master/AreaMaster";

// Normalize API URL and route URL
const normalizePath = (path = "") => {
  const cleanPath = `/${String(path).trim()}`
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");

  return cleanPath === "" ? "/" : cleanPath;
};


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
  "/profile": Profile,

  "/advance-emi": AdvanceEMI,
  "/emi-details": EMIDetails,
  "/collection-details": CollectionDetails,

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
  "/master/zone-master": ZoneMaster,
  "/master/region-master": RegionMaster,
  "/master/area-master": AreaMaster,


  "/status": RedirectPage,

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
  "/profile",
  "/admin/manage-permission",
  "/admin/manage-user",
  "/lead-center/all-leads",

  "/leads-detail",
  "/credit-detail",
  "/kyc-detail",
  "/telecalling-detail",
  "/disbursement-detail",
  "/product-leads-detail",
  "/collection-details",

  "/master/zone-master",
  "/master/region-master",
  "/master/area-master",

  "/emi-details"
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
              // <div className="p-6 text-center">Loading permissions...</div>
              <Loader text="Loading permissions..." />
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
              // <div className="p-6 text-center">Loading permissions...</div>
              <Loader text="Loading permissions..." />
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
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    const handleRateLimit = () => {
      setIsRateLimited(true);
    };

    window.addEventListener("rate-limit", handleRateLimit);

    return () => {
      window.removeEventListener("rate-limit", handleRateLimit);
    };
  }, []);

  return (
    <Router>
      <AuthDataProvider>
        <AppRoutes />

        {isRateLimited && (
          <RateLimitPage
            onGoBack={() => setIsRateLimited(false)}
          />
        )}
      </AuthDataProvider>
    </Router>
  );
}

export default App;
