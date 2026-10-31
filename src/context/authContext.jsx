import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthDataContext = createContext(null);

const isValidAuthData = (data) => {
  const expiresAt = new Date(data?.expires_at).getTime();
  return Boolean(data?.access_token && Number.isFinite(expiresAt) && expiresAt > Date.now());
};

export const AuthDataProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authData, setAuthData] = useState(() => {
    try {
      const storedData = localStorage.getItem("authData");
      const parsedData = storedData ? JSON.parse(storedData) : null;
      if (parsedData && !isValidAuthData(parsedData)) {
        localStorage.removeItem("authData");
        return null;
      }
      return parsedData;
    } catch (error) {
      console.error("Failed to load auth data:", error);
      return null;
    }
  });

  const login = (response, redirectTo = "/") => {
    const responseData = response?.data?.data?.access_token
      ? response.data.data
      : response?.data?.access_token
        ? response.data
        : response;

    if (!responseData?.access_token) {
      return false;
    }

    const userData = {
      user_id: responseData.user_id,
      full_name: responseData.full_name,
      email_id: responseData.email_id,
      role: responseData.role,
      access_token: responseData.access_token,
      expires_at: responseData.expires_at,
    };

    if (!isValidAuthData(userData)) return false;

    localStorage.setItem("authData", JSON.stringify(userData));
    setAuthData(userData);
    navigate(redirectTo, { replace: true });

    return true;
  };

  const logout = useCallback(() => {
    localStorage.removeItem("authData");
    setAuthData(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!authData) return undefined;

    const expiresAt = new Date(authData.expires_at).getTime();
    const timeoutId = window.setTimeout(
      logout,
      Math.min(Math.max(expiresAt - Date.now(), 0), 2147483647),
    );

    return () => window.clearTimeout(timeoutId);
  }, [authData, logout]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== "authData") return;

      try {
        const nextAuthData = event.newValue ? JSON.parse(event.newValue) : null;
        setAuthData(isValidAuthData(nextAuthData) ? nextAuthData : null);
      } catch {
        setAuthData(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = {
    authData,
    user: authData,
    accessToken: authData?.access_token || null,
    userId: authData?.user_id || null,
    role: authData?.role || null,
    isLoggedIn: isValidAuthData(authData),
    login,
    logout,
  };

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  );
};

export const useAuthData = () => {
  return useContext(AuthDataContext);
};

export default AuthDataContext;