// import { useState } from "react";
// import {
//   RiMenuLine,
//   RiSearchLine,
//   RiNotification3Line,
//   RiMailLine,
//   RiArrowDownSLine,
//   RiLogoutBoxRLine,
//   RiUser3Line,
//   RiSettings3Line,
//   RiDashboardLine,
//   RiWalletLine,
//   RiMenuFoldLine,
//   RiMenuUnfoldLine,
// } from "react-icons/ri";
// import { Link, useNavigate } from "react-router-dom";
// import Icon from "../components/utils/Icon";

// const Navbar = ({ 
//   setIsMobileOpen, 
//   setIsSidebarOpen, 
//   isSidebarOpen 
// }) => {
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <>
//       {/* Profile Dropdown Backdrop */}
//       {profileOpen && (
//         <div
//           onClick={() => setProfileOpen(false)}
//           className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm"
//         />
//       )}

//       {/* Search Backdrop */}
//       {searchOpen && (
//         <div
//           onClick={() => setSearchOpen(false)}
//           className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm"
//         />
//       )}

//       <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 md:px-6 flex items-center justify-between shadow-sm">
        
//         {/* Left Section */}
//         <div className="flex items-center gap-3">
//           {/* Mobile Menu Toggle */}
//           <button
//             onClick={() => setIsMobileOpen(true)}
//             className="md:hidden text-gray-600 hover:text-primary p-1.5 rounded-lg hover:bg-pink-50 transition-all duration-200"
//           >
//             <RiMenuLine size={22} />
//           </button>

//           {/* Desktop Sidebar Toggle */}
//           <button
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             className="hidden md:flex text-gray-500 hover:text-primary p-1.5 rounded-lg hover:bg-pink-50 transition-all duration-200 cursor-pointer"
//             title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
//           >
//             {isSidebarOpen ? (
//               <RiMenuFoldLine size={22} />
//             ) : (
//               <RiMenuUnfoldLine size={22} />
//             )}
//           </button>

//           {/* Page Title - optional */}
//           {/* <div className="hidden sm:block">
//             <h1 className="text-sm font-semibold text-gray-800">
//               Loan Origination System
//             </h1>
//           </div> */}
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-3">
//           {/* Divider */}
//           <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

//           {/* Profile */}
//           <div className="relative">
//             <button
//               onClick={() => setProfileOpen(!profileOpen)}
//               className="flex items-center gap-2.5 group p-0.5 rounded-lg transition-all cursor-pointer"
//             >
//               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white text-xs font-medium shadow-sm shadow-primary/20">
//                 RK
//               </div>

//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-medium text-gray-800 leading-none">Rohit</p>
//                 <p className="text-xs text-gray-500 mt-0.5">Admin</p>
//               </div>

//               <RiArrowDownSLine
//                 className={`text-gray-400 text-sm transition-transform duration-200 hidden md:block ${
//                   profileOpen ? "rotate-180 text-primary" : ""
//                 }`}
//               />
//             </button>

//             {/* Profile Dropdown */}
//             {profileOpen && (
//               <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200/80 shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-slideDown">
//                 <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-white">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white text-sm font-medium shadow-sm shadow-primary/20">
//                       RK
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-800">Rohit Kumar</p>
//                       <p className="text-xs text-gray-500">rohit@company.com</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="py-1">
//                   <Link 
//                     to="/profile" 
//                     className="group w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
//                   >
//                     <RiUser3Line size={16} className="text-gray-400 group-hover:text-primary" />
//                     Profile
//                   </Link>

//                   <Link 
//                     to="/dashboard" 
//                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
//                   >
//                     <RiDashboardLine size={16} className="text-gray-400 group-hover:text-primary" />
//                     Dashboard
//                   </Link>

//                   <div className="border-t border-gray-100 my-1"></div>

//                   <button
//                     onClick={() => navigate("/login")}
//                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
//                   >
//                     <RiLogoutBoxRLine size={16} className="text-red-400" />
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Mobile Search Modal */}
//       {searchOpen && (
//         <div className="fixed inset-0 z-40 lg:hidden">
//           <div className="bg-white p-4">
//             <div className="flex items-center gap-3">
//               <RiSearchLine className="text-gray-400 text-xl" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="flex-1 border-none outline-none text-base text-gray-700"
//                 autoFocus
//               />
//               <button
//                 onClick={() => setSearchOpen(false)}
//                 className="text-gray-500 font-medium"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;



import { useState } from "react";
import {
  RiMenuLine,
  RiArrowDownSLine,
  RiLogoutBoxRLine,
  RiUser3Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "react-icons/ri";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

const Navbar = ({
  setIsMobileOpen,
  setIsSidebarOpen,
  isSidebarOpen,
}) => {
  const [profileOpen, setProfileOpen] =
    useState(false);

  const navigate = useNavigate();

  return (
    <>
      {/* =====================================
          DROPDOWN BACKDROP
      ===================================== */}
      {profileOpen && (
        <div
          onClick={() =>
            setProfileOpen(false)
          }
          className="
            fixed
            inset-0
            z-30
          "
        />
      )}

      {/* =====================================
          NAVBAR
      ===================================== */}
      <header
        className="
          sticky
          top-0
          z-30

          h-[54px]

          shrink-0

          bg-white

          border-b
          border-[#dfe8e4]

          flex
          items-center
          justify-between

          px-4
          md:px-5
        "
      >
        {/* ===================================
            LEFT SECTION
        =================================== */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          {/* Mobile Menu */}
          <button
            onClick={() =>
              setIsMobileOpen(true)
            }
            className="
              md:hidden

              text-[#45645a]

              hover:text-[#176f4d]

              p-1.5

              rounded-md

              hover:bg-[#f0f6f3]

              transition
            "
          >
            <RiMenuLine size={21} />
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() =>
              setIsSidebarOpen(
                !isSidebarOpen
              )
            }
            className="
              hidden
              md:flex

              text-[#667d75]

              hover:text-[#176f4d]

              p-1.5

              rounded-md

              hover:bg-[#f0f6f3]

              transition

              cursor-pointer
            "
            title={
              isSidebarOpen
                ? "Collapse sidebar"
                : "Expand sidebar"
            }
          >
            {isSidebarOpen ? (
              <RiMenuFoldLine size={25} />
            ) : (
              <RiMenuUnfoldLine size={25} />
            )}
          </button>
        </div>

        {/* ===================================
            RIGHT SECTION
        =================================== */}
        <div className="relative">
          <button
            onClick={() =>
              setProfileOpen(
                !profileOpen
              )
            }
            className="
              flex
              items-center
              gap-2

              cursor-pointer

              p-1

              rounded-md

              hover:bg-[#f4f8f6]

              transition
            "
          >
            {/* Avatar */}
            <div
              className="
                w-[35px]
                h-[35px]

                rounded-full

                bg-primary

                flex
                items-center
                justify-center

                text-[12px]

                font-bold

                text-white
              "
            >
              RK
            </div>

            {/* Name - desktop */}
            <div
              className="
                hidden
                md:block
                text-left
              "
            >
              <p
                className="
                  text-[13px]
                  font-semibold
                  text-[#263d35]
                  leading-none
                "
              >
                Rohit
              </p>

              <p
                className="
                  text-[10px]
                  text-[#7b9088]
                  mt-[3px]
                "
              >
                Admin
              </p>
            </div>

            <RiArrowDownSLine
              size={16}
              className={`
                text-[#71857e]

                transition-transform
                duration-200

                hidden
                md:block

                ${
                  profileOpen
                    ? "rotate-180 text-[#176f4d]"
                    : ""
                }
              `}
            />
          </button>

          {/* ===================================
              PROFILE DROPDOWN
          =================================== */}
          {profileOpen && (
            <div
              className="
                absolute

                right-0
                top-[39px]

                w-[250px]

                bg-white

                border
                border-[#dfe8e4]

                rounded-[10px]

                shadow-xl
                shadow-black/10

                overflow-hidden

                z-50
              "
            >
              {/* User Header */}
              <div
                className="
                  px-4
                  py-4

                  border-b
                  border-[#edf2ef]

                  bg-[#f7faf8]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      w-[38px]
                      h-[38px]

                      rounded-full

                      bg-primary

                      text-white

                      flex
                      items-center
                      justify-center

                      text-[11px]
                      font-semibold
                    "
                  >
                    RK
                  </div>

                  <div>
                    <p
                      className="
                        text-[12px]
                        font-semibold
                        text-[#253b33]
                      "
                    >
                      Rohit Kumar
                    </p>

                    <p
                      className="
                        text-[10px]
                        text-[#7a8e87]
                        mt-[2px]
                      "
                    >
                      Administrator
                    </p>
                  </div>
                </div>
              </div>

              {/* Dropdown Items */}
              <div className="p-1.5">
                <Link
                  to="/profile"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="
                    flex
                    items-center
                    gap-3

                    px-3
                    py-2.5

                    rounded-md

                    text-[11px]
                    text-[#445c53]

                    hover:bg-[#f1f7f4]
                    hover:text-[#176f4d]

                    transition
                  "
                >
                  <RiUser3Line
                    size={16}
                  />

                  Profile
                </Link>

                <div
                  className="
                    border-t
                    border-[#edf2ef]
                    my-1
                  "
                />

                <button
                  onClick={() =>
                    navigate("/login")
                  }
                  className="
                    w-full

                    flex
                    items-center
                    gap-3

                    px-3
                    py-2.5

                    rounded-md

                    text-[11px]
                    text-red-600

                    hover:bg-red-50

                    transition

                    cursor-pointer
                  "
                >
                  <RiLogoutBoxRLine
                    size={16}
                  />

                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;