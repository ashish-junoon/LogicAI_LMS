
// import { useState } from "react";
// import {
//   RiMenuLine,
//   RiArrowDownSLine,
//   RiLogoutBoxRLine,
//   RiUser3Line,
//   RiMenuFoldLine,
//   RiMenuUnfoldLine,
// } from "react-icons/ri";
// import {
//   Link,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// const Navbar = ({
//   setIsMobileOpen,
//   setIsSidebarOpen,
//   isSidebarOpen,
// }) => {
//   const [profileOpen, setProfileOpen] =
//     useState(false);

//   const navigate = useNavigate();

//   return (
//     <>
//       {/* =====================================
//           DROPDOWN BACKDROP
//       ===================================== */}
//       {profileOpen && (
//         <div
//           onClick={() =>
//             setProfileOpen(false)
//           }
//           className="
//             fixed
//             inset-0
//             z-30
//           "
//         />
//       )}

//       {/* =====================================
//           NAVBAR
//       ===================================== */}
//       <header
//         className="
//           sticky
//           top-0
//           z-30

//           h-[60px]

//           shrink-0

//           bg-white

//           border-b
//           border-gray-200/80

//           flex
//           items-center
//           justify-between

//           px-4
//           md:px-5
//         "
//       >
//         {/* ===================================
//             LEFT SECTION
//         =================================== */}
//         <div
//           className="
//             flex
//             items-center
//             gap-3
//           "
//         >
//           {/* Mobile Menu */}
//           <button
//             onClick={() =>
//               setIsMobileOpen(true)
//             }
//             className="
//               md:hidden

//               text-[#45645a]

//               hover:text-[#176f4d]

//               p-1.5

//               rounded-md

//               hover:bg-[#f0f6f3]

//               transition
//             "
//           >
//             <RiMenuLine size={21} />
//           </button>

//           {/* Desktop Sidebar Toggle */}
//           <button
//             onClick={() =>
//               setIsSidebarOpen(
//                 !isSidebarOpen
//               )
//             }
//             className="
//               hidden
//               md:flex

//               text-[#667d75]

//               hover:text-[#176f4d]

//               p-1.5

//               rounded-md

//               hover:bg-[#f0f6f3]

//               transition

//               cursor-pointer
//             "
//             title={
//               isSidebarOpen
//                 ? "Collapse sidebar"
//                 : "Expand sidebar"
//             }
//           >
//             {isSidebarOpen ? (
//               <RiMenuFoldLine size={25} />
//             ) : (
//               <RiMenuUnfoldLine size={25} />
//             )}
//           </button>
//         </div>

//         {/* ===================================
//             RIGHT SECTION
//         =================================== */}
//         <div className="relative">
//           <button
//             onClick={() =>
//               setProfileOpen(
//                 !profileOpen
//               )
//             }
//             className="
//               flex
//               items-center
//               gap-2

//               cursor-pointer

//               p-1

//               rounded-md

//               hover:bg-[#f4f8f6]

//               transition
//             "
//           >
//             {/* Avatar */}
//             <div
//               className="
//                 w-[35px]
//                 h-[35px]

//                 rounded-full

//                 bg-primary

//                 flex
//                 items-center
//                 justify-center

//                 text-[12px]

//                 font-bold

//                 text-white
//               "
//             >
//               RK
//             </div>

//             {/* Name - desktop */}
//             <div
//               className="
//                 hidden
//                 md:block
//                 text-left
//               "
//             >
//               <p
//                 className="
//                   text-[13px]
//                   font-semibold
//                   text-[#263d35]
//                   leading-none
//                 "
//               >
//                 Rohit
//               </p>

//               <p
//                 className="
//                   text-[10px]
//                   text-[#7b9088]
//                   mt-[3px]
//                 "
//               >
//                 Admin
//               </p>
//             </div>

//             <RiArrowDownSLine
//               size={16}
//               className={`
//                 text-[#71857e]

//                 transition-transform
//                 duration-200

//                 hidden
//                 md:block

//                 ${
//                   profileOpen
//                     ? "rotate-180 text-[#176f4d]"
//                     : ""
//                 }
//               `}
//             />
//           </button>

//           {/* ===================================
//               PROFILE DROPDOWN
//           =================================== */}
//           {profileOpen && (
//             <div
//               className="
//                 absolute

//                 right-0
//                 top-[39px]

//                 w-[250px]

//                 bg-white

//                 border
//                 border-[#dfe8e4]

//                 rounded-[10px]

//                 shadow-xl
//                 shadow-black/10

//                 overflow-hidden

//                 z-50
//               "
//             >
//               {/* User Header */}
//               <div
//                 className="
//                   px-4
//                   py-4

//                   border-b
//                   border-[#edf2ef]

//                   bg-[#f7faf8]
//                 "
//               >
//                 <div
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                   "
//                 >
//                   <div
//                     className="
//                       w-[38px]
//                       h-[38px]

//                       rounded-full

//                       bg-primary

//                       text-white

//                       flex
//                       items-center
//                       justify-center

//                       text-[11px]
//                       font-semibold
//                     "
//                   >
//                     RK
//                   </div>

//                   <div>
//                     <p
//                       className="
//                         text-[12px]
//                         font-semibold
//                         text-[#253b33]
//                       "
//                     >
//                       Rohit Kumar
//                     </p>

//                     <p
//                       className="
//                         text-[10px]
//                         text-[#7a8e87]
//                         mt-[2px]
//                       "
//                     >
//                       Administrator
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Dropdown Items */}
//               <div className="p-1.5">
//                 <Link
//                   to="/profile"
//                   onClick={() =>
//                     setProfileOpen(false)
//                   }
//                   className="
//                     flex
//                     items-center
//                     gap-3

//                     px-3
//                     py-2.5

//                     rounded-md

//                     text-[11px]
//                     text-[#445c53]

//                     hover:bg-[#f1f7f4]
//                     hover:text-[#176f4d]

//                     transition
//                   "
//                 >
//                   <RiUser3Line
//                     size={16}
//                   />

//                   Profile
//                 </Link>

//                 <div
//                   className="
//                     border-t
//                     border-[#edf2ef]
//                     my-1
//                   "
//                 />

//                 <button
//                   onClick={() =>
//                     navigate("/login")
//                   }
//                   className="
//                     w-full

//                     flex
//                     items-center
//                     gap-3

//                     px-3
//                     py-2.5

//                     rounded-md

//                     text-[11px]
//                     text-red-600

//                     hover:bg-red-50

//                     transition

//                     cursor-pointer
//                   "
//                 >
//                   <RiLogoutBoxRLine
//                     size={16}
//                   />

//                   Sign out
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>
//     </>
//   );
// };

// export default Navbar;


import { useState } from "react";
import { FiMenu, FiSearch, FiBell, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";

export default function Navbar({ onToggleSidebar, onToggleMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-surface-border bg-white px-4 lg:px-6">
      {/* collapse toggle — desktop */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-surface lg:flex cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <FiMenu size={18} />
      </button>

      {/* drawer toggle — mobile */}
      <button
        type="button"
        onClick={onToggleMobile}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-surface lg:hidden cursor-pointer"
        aria-label="Open menu"
      >
        <FiMenu size={18} />
      </button>

      {/* search */}
      <div className="relative hidden max-w-sm flex-1 sm:block">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search leads, loans, customers..."
          className="w-full rounded-lg border border-surface-border bg-surface py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-surface"
          aria-label="Notifications"
        >
          <FiBell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-600" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              AS
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-medium text-gray-900">Rohit Koli</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <FiChevronDown size={14} className="hidden text-gray-400 sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-surface-border bg-white py-1 shadow-card">
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-surface">
                  <FiUser size={15} /> My Profile
                </button>
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-surface">
                  <FiLogOut size={15} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
