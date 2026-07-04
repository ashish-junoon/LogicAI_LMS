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

const Navbar = ({ setIsMobileOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">

      {/* Left */}
      <div className="flex items-center gap-4">

        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-gray-700"
        >
          <RiMenuLine size={24} />
        </button>

        <div className="hidden md:flex items-center relative">

          <RiSearchLine
            size={18}
            className="absolute left-4 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search customer, loan id..."
            className="w-80 h-10 pl-11 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />

        </div>

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
            className="flex items-center gap-3"
          >

            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="profile"
              className="h-8 w-8 rounded-full border"
            />

            <div className="hidden md:block text-left">

              <h4 className="text-sm font-semibold text-gray-800">
                Rohit
              </h4>

              <p className="text-xs text-gray-500">
                Super Admin
              </p>

            </div>

            <RiArrowDownSLine
              className={`transition ${
                profileOpen ? "rotate-180" : ""
              }`}
            />

          </button>

          {profileOpen && (

            <div className="absolute right-0 mt-3 w-56 rounded-xl border bg-white shadow-xl overflow-hidden">

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100">

                <RiUser3Line />

                My Profile

              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100">

                <RiSettings3Line />

                Settings

              </button>

              <div className="border-t"></div>

              <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50">

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