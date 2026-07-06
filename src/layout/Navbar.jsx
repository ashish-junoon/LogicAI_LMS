import { useState } from "react";
import {
  RiMenuLine,
  RiSearchLine,
  RiNotification3Line,
  RiMailLine,
  RiArrowDownSLine,
  RiLogoutBoxRLine,
  RiUser3Line,
  RiSettings3Line,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setIsMobileOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden text-gray-700"
        >
          <RiMenuLine size={24} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button className="relative">
          <RiNotification3Line
            size={22}
            className="text-gray-600 hover:text-primary"
          />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </button>

        {/* Divider */}

        <div className="h-8 w-px bg-gray-300"></div>

        {/* Profile */}

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
              RK
            </div>

            <div className="hidden md:block text-left">
              <h4 className="text-sm font-semibold text-gray-800">Rohit</h4>

              <p className="text-xs text-gray-500">Super Admin</p>
            </div>

            <RiArrowDownSLine
              className={`transition ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-md border border-gray-200 bg-white shadow-xl overflow-hidden">
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                <RiUser3Line />
                My Profile
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                <RiSettings3Line />
                Settings
              </button>

              <div className="border-t border-gray-300"></div>

              <button onClick={()=> navigate("/login")} className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer">
                <RiLogoutBoxRLine />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
