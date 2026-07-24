import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Button from "../components/utils/Button";

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isDark={true} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Right Section */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Navbar */}
        <Navbar setIsMobileOpen={setIsMobileOpen} />

        <div className={`flex-1 ${location.pathname != "/" && "p-4 md:p-6"} bg-gray-200/80 overflow-y-auto overflow-x-hidden`}>
          {location.pathname != "/" &&
          <Button 
            btnName={"Back"}
            btnIcon={"TiArrowBack"}
            style={"bg-primary text-white text-sm font-semibold mb-1"}
            btnIconSize={18}
            onClick={()=> navigate(-1)}
          />}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
