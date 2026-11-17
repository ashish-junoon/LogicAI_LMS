
import React, { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthData } from "../../context/authContext";

const normalizePath = (path = "/") => {
  const normalized = path
    .split("?")[0]
    .split("#")[0]
    .trim()
    .replace(/\/+$/, "")
    .toLowerCase();

  return normalized || "/";
};

function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Access Denied
        </h1>
        <p className="mt-2 text-gray-500">
          You don't have permission to access any page.
          Please contact your administrator.
        </p>
      </div>
    </div>
  );
}

function PermissionGuard() {
  const { permissions, permissionsLoading } = useAuthData();
  const location = useLocation();

  // Support both flat permissions and grouped permissions
  const permissionPages = useMemo(() => {
    if (!Array.isArray(permissions)) return [];

    return permissions.flatMap((item) =>
      Array.isArray(item?.loginpageNames)
        ? item.loginpageNames
        : [item]
    );
  }, [permissions]);

  // Only active pages with read permission
  const allowedPaths = useMemo(() => {
    return new Set(
      permissionPages
        .filter(
          (page) =>
            page?.set_permission_access === true &&
            page?.is_active === true
        )
        .map((page) => normalizePath(page?.page_url))
    );
  }, [permissionPages]);

  const currentPath = normalizePath(location.pathname);

  const hasDashboardPermission = allowedPaths.has("/");

  // Wait until permission data is loaded
  if (permissionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading permissions...</div>
      </div>
    );
  }

  // Dashboard itself also requires permission
  if (currentPath === "/") {
    return hasDashboardPermission ? <Outlet /> : <AccessDenied />;
  }

  // Unauthorized URLs redirect to dashboard
  if (!allowedPaths.has(currentPath)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PermissionGuard;
