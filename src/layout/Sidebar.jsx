// import { useState, useEffect } from "react";
// import { RiArrowDownSLine, RiCloseLine,
//   RiDashboardLine, RiBankCard2Line,
// } from "react-icons/ri";
// import { IoSettings } from "react-icons/io5";
// import { FaMoneyBillTransfer } from "react-icons/fa6";
// import { NavLink, useLocation } from "react-router-dom";
// import { FaRegObjectUngroup } from "react-icons/fa";

// const Sidebar = ({ 
//   isMobileOpen, 
//   setIsMobileOpen,
//   isSidebarOpen,
// }) => {
//   const [openMenus, setOpenMenus] = useState({});
//   const location = useLocation();

//   // Close sidebar on route change for mobile
//   useEffect(() => {
//     if (isMobileOpen) {
//       setIsMobileOpen(false);
//     }
//   }, [location.pathname]);

//   const sidebarData = [
//     {
//       title: "Dashboard",
//       path: "/",
//       icon: RiDashboardLine,
//     },
//     {
//       title: "Lead Management",
//       icon: FaMoneyBillTransfer,
//       children: [
//         { title: "Draft Leads", path: "/leads-draft" },
//         { title: "New Leads", path: "/leads-new" },
//         { title: "Credit Analysis", path: "/leads-assesment" },
//         { title: "Kyc Verification", path: "/leads-kyc" },
//         // { title: "Apply Loan", path: "/apply-loan" },
//         // { title: "All Loans", path: "/all-loans" },
//         // { title: "Loan Approval", path: "/loan-approval" },
//         { title: "Disbursement", path: "/leads-disbursement" },
//         // { title: "Active Loans", path: "/active-loan" },
//         // { title: "Closed Loans", path: "/closed-loans" },
//         { title: "Rejected Lead", path: "/leads-rejected" },
//       ],
//     },
//     {
//       title: "Loan Management",
//       icon: FaMoneyBillTransfer,
//       children: [
//         // { title: "Apply Loan", path: "/apply-loan" },
//         { title: "All Loans", path: "/loan-all" },
//         // { title: "Active Loans", path: "/active-loan" },
//         // { title: "Closed Loans", path: "/closed-loans" },
//         // { title: "Rejected Lead", path: "/leads-rejected" },
//       ],
//     },
//     {
//       title: "EMI Collection",
//       icon: RiBankCard2Line,
//       children: [
//         { title: "Advance EMI", path: "/advance-emi" },
//       ],
//     },
//     {
//       title: "Lead Consolidation",
//       icon: FaRegObjectUngroup,
//       children: [
//         { title: "All Product Leads", path: "/all-leads" },
//       ],
//     },
//     {
//       title: "Master",
//       icon: IoSettings,
//       children: [
//         { title: "Loan Product", path: "/product-master" },
//         { title: "Branches", path: "/branches-master" },
//         { title: "Branch Managers", path: "/branch-managers-master" },
//         { title: "Financial Years", path: "/finance-years-master" },
//         { title: "Relationships", path: "/relationships-master" },
//         { title: "State Master", path: "/state-master" },
//         { title: "City Master", path: "/city-master" },
//         { title: "Occupations", path: "/occupations-master" },
//         { title: "Designation Master", path: "/designation-master" },
//         { title: "PD Question Master", path: "/quetionare-master" },
//       ],
//     },
//   ];

//   const toggleMenu = (index) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const isActive = (path) => location.pathname === path;

//   // Desktop sidebar width classes
//   const sidebarWidth = isSidebarOpen ? "w-65" : "w-20";
//   const sidebarClasses = `fixed md:static top-0 left-0 z-50 h-screen bg-gray-900 flex flex-col
//     transform transition-all duration-300 ease-in-out shadow-2xl shadow-black/50
//     ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//     md:translate-x-0 border-r border-gray-700/60
//     ${sidebarWidth}`;

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isMobileOpen && (
//         <div
//           onClick={() => setIsMobileOpen(false)}
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={sidebarClasses}>
//         {/* Header */}
//         <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-700/60 shrink-0 bg-gradient-to-r from-gray-900 to-gray-800/50
//           ${!isSidebarOpen && "md:justify-center"}`}>
//           <div className={`flex items-center gap-2.5 ${!isSidebarOpen && "md:justify-center"}`}>
//             <div className="h-9 w-9 rounded-md bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
//               <span className="text-white font-bold text-sm">LMS</span>
//             </div>
//             <div className={`${!isSidebarOpen && "md:hidden"}`}>
//               <h2 className="text-md font-extrabold text-white leading-tight tracking-tight">
//                 OFFICE <span className="text-primary font-extrabold">PULSE</span>
//               </h2>
//               <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">
//                 Loan Management System
//               </p>
//             </div>
//           </div>

//           {/* Close button for mobile */}
//           <button 
//             onClick={() => setIsMobileOpen(false)} 
//             className="md:hidden text-gray-400 hover:text-white transition-all p-1 hover:bg-gray-800 rounded-lg"
//           >
//             <RiCloseLine size={18} />
//           </button>
//         </div>

//         {/* Menu */}
//         <div className={`flex-1 overflow-y-auto py-2 px-2 space-y-1 no-scrollbar mt-3
//           ${!isSidebarOpen && "md:px-1"}`}>
//           {sidebarData.map((item, index) => {
//             const Icon = item.icon;

//             return (
//               <div key={index}>
//                 {item.children ? (
//                   <>
//                     {/* Parent Menu */}
//                     <button
//                       onClick={() => toggleMenu(index)}
//                       className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group cursor-pointer
//                         ${openMenus[index]
//                           ? "bg-primary/90 text-white font-medium"
//                           : "text-gray-300 hover:bg-gray-800 hover:text-white"
//                         }
//                         ${!isSidebarOpen && "md:px-2 md:justify-center"}`}
//                       title={!isSidebarOpen ? item.title : ""}
//                     >
//                       <div className={`flex items-center gap-2.5 ${!isSidebarOpen && "md:gap-0"}`}>
//                         <Icon size={17} className={`transition-colors shrink-0 ${
//                           openMenus[index] 
//                             ? "text-white" 
//                             : "text-gray-400 group-hover:text-primary"
//                         }`} />
//                         <span className={`text-sm font-medium ${!isSidebarOpen && "md:hidden"}`}>
//                           {item.title}
//                         </span>
//                       </div>
//                       <RiArrowDownSLine
//                         className={`text-gray-400 text-sm transition-all duration-300 ${
//                           openMenus[index] 
//                             ? "rotate-180 text-white" 
//                             : "group-hover:text-white"
//                         }
//                         ${!isSidebarOpen && "md:hidden"}`}
//                       />
//                     </button>

//                     {/* Submenu */}
//                     <div
//                       className={`overflow-hidden transition-all duration-300 ease-in-out ${
//                         openMenus[index] ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
//                       }
//                       ${!isSidebarOpen && "md:hidden"}`}
//                     >
//                       <div className="ml-5 mt-0.5 space-y-1 border-l-2 border-gray-700/60 pl-3">
//                         {item.children.map((sub, i) => (
//                           <NavLink
//                             key={i}
//                             to={sub.path}
//                             className={({ isActive: navActive }) =>
//                               `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200
//                               ${
//                                 navActive
//                                   ? "bg-primary text-white shadow-lg shadow-primary/20"
//                                   : "text-gray-400 hover:text-white hover:bg-gray-800"
//                               }`
//                             }
//                           >
//                             <span
//                               className={`w-1 h-1 rounded-full transition-colors ${
//                                 isActive(sub.path) 
//                                   ? "bg-white" 
//                                   : "bg-gray-600 group-hover:bg-gray-400"
//                               }`}
//                             />
//                             <span className="text-sm">{sub.title}</span>
//                           </NavLink>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   /* Single Menu Item */
//                   <NavLink
//                     to={item.path}
//                     className={({ isActive: navActive }) =>
//                       `flex items-center gap-2.5 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200
//                       ${!isSidebarOpen && "md:px-2 md:justify-center"}
//                       ${
//                         navActive
//                           ? "bg-primary text-white shadow-lg shadow-primary/20"
//                           : "text-gray-300 hover:bg-gray-800 hover:text-white"
//                       }`
//                     }
//                     title={!isSidebarOpen ? item.title : ""}
//                   >
//                     <Icon size={17} className={`shrink-0 transition-colors ${
//                       isActive(item.path)
//                         ? "text-white" 
//                         : "text-gray-400 group-hover:text-primary"
//                     }`} />
//                     <span className={`${!isSidebarOpen && "md:hidden"}`}>
//                       {item.title}
//                     </span>
//                   </NavLink>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Footer */}
//         {/* <div className={`px-5 py-3 border-t border-gray-700/60 shrink-0
//           ${!isSidebarOpen && "md:px-2"}`}>
//           <div className={`flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-md px-3 py-2
//             ${!isSidebarOpen && "md:justify-center md:px-1"}`}>
//             <p className={`text-[10px] text-gray-400 font-semibold ${!isSidebarOpen && "md:hidden"}`}>
//               Powered by © 2026 <span className="text-primary">LogicAI Tech</span>
//             </p>
//             {!isSidebarOpen && (
//               <span className="hidden md:block text-[10px] text-gray-400 font-semibold">©</span>
//             )}
//           </div>
//         </div> */}
//       </aside>
//     </>
//   );
// };

// export default Sidebar;


import { useEffect, useState } from "react";

import {
  RiArrowDownSLine,
  RiCloseLine,
  RiDashboardLine,
  RiBankCard2Line,
} from "react-icons/ri";

import { IoSettings } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import { FaRegObjectUngroup } from "react-icons/fa";

const Sidebar = ({
  isMobileOpen,
  setIsMobileOpen,
  isSidebarOpen,
}) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  // =========================================
  // SIDEBAR MENU DATA
  // =========================================

  const sidebarData = [
    {
      title: "Dashboard",
      path: "/",
      icon: RiDashboardLine,
    },

    {
      title: "Lead Management",
      icon: FaMoneyBillTransfer,
      children: [
        {
          title: "Draft Leads",
          path: "/leads-draft",
        },
        {
          title: "New Leads",
          path: "/leads-new",
        },
        {
          title: "Credit Analysis",
          path: "/leads-assesment",
        },
        {
          title: "Kyc Verification",
          path: "/leads-kyc",
        },
        {
          title: "Disbursement",
          path: "/leads-disbursement",
        },
        {
          title: "Rejected Lead",
          path: "/leads-rejected",
        },
      ],
    },

    {
      title: "Loan Management",
      icon: FaMoneyBillTransfer,
      children: [
        {
          title: "All Loans",
          path: "/loan-all",
        },
      ],
    },

    {
      title: "EMI Collection",
      icon: RiBankCard2Line,
      children: [
        {
          title: "Advance EMI",
          path: "/advance-emi",
        },
      ],
    },

    {
      // title: "Lead Consolidation",
      title: "Leads Center",
      icon: FaRegObjectUngroup,
      children: [
        {
          title: "All Product Leads",
          path: "/all-leads",
        },
      ],
    },

    {
      title: "Master",
      icon: IoSettings,
      children: [
        {
          title: "Loan Product",
          path: "/product-master",
        },
        {
          title: "Branches",
          path: "/branches-master",
        },
        {
          title: "Branch Managers",
          path: "/branch-managers-master",
        },
        {
          title: "Financial Years",
          path: "/finance-years-master",
        },
        {
          title: "Relationships",
          path: "/relationships-master",
        },
        {
          title: "State Master",
          path: "/state-master",
        },
        {
          title: "City Master",
          path: "/city-master",
        },
        {
          title: "Occupations",
          path: "/occupations-master",
        },
        {
          title: "Designation Master",
          path: "/designation-master",
        },
        {
          title: "PD Question Master",
          path: "/quetionare-master",
        },
        {
          title: "Page Master",
          path: "/page-master",
        },
        {
          title: "Vendor Master",
          path: "/vendor-master",
        },
      ],
    },
  ];

  // =========================================
  // CLOSE MOBILE SIDEBAR ON ROUTE CHANGE
  // =========================================

  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [location.pathname]);

  // =========================================
  // AUTO OPEN ACTIVE SUBMENU
  // =========================================

  useEffect(() => {
    const activeMenus = {};

    sidebarData.forEach((item, index) => {
      if (
        item.children?.some(
          (child) => child.path === location.pathname
        )
      ) {
        activeMenus[index] = true;
      }
    });

    setOpenMenus((prev) => ({
      ...prev,
      ...activeMenus,
    }));
  }, [location.pathname]);

  // =========================================
  // TOGGLE SUBMENU
  // =========================================

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // =========================================
  // CHECK ACTIVE ROUTE
  // =========================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // =========================================
  // CHECK ACTIVE CHILD
  // =========================================

  const hasActiveChild = (item) => {
    return item.children?.some(
      (child) => child.path === location.pathname
    );
  };

  return (
    <>
      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            md:hidden
          "
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside
        className={`
          fixed
          md:static

          top-0
          left-0

          z-50

          h-screen
          shrink-0

          bg-[#1F1F2E]
          text-white

          border-r
          border-[#303044]

          flex
          flex-col

          transition-all
          duration-300
          ease-in-out

          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }

          ${
            isSidebarOpen
              ? "w-[250px]"
              : "w-[68px]"
          }
        `}
      >
        {/* =========================================
            SIDEBAR HEADER
        ========================================= */}

        <div
          className={`
            h-[60px]
            shrink-0

            flex
            items-center

            border-b
            border-[#303044]

            ${
              isSidebarOpen
                ? "px-4 justify-start"
                : "px-2 justify-center"
            }
          `}
        >
          <div
            className="
              flex
              items-center
              gap-2.5
              min-w-0
            "
          >
            {/* Logo */}

            <div
              className="
                w-[32px]
                h-[32px]

                shrink-0

                rounded-[8px]

                bg-primary

                flex
                items-center
                justify-center

                shadow-sm
              "
            >
              <span
                className="
                  text-white
                  font-bold
                  text-[12px]
                "
              >
                OP
              </span>
            </div>

            {/* Brand */}

            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p
                  className="
                    text-[13px]
                    font-bold
                    text-white
                    whitespace-nowrap
                    leading-none
                    tracking-wide
                  "
                >
                  OFFICE PULSE
                </p>

                <p
                  className="
                    text-[9px]
                    text-[#9A9AAD]
                    mt-[5px]
                    whitespace-nowrap
                    uppercase
                    tracking-wide
                  "
                >
                  Loan Management
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}

          <button
            onClick={() => setIsMobileOpen(false)}
            className="
              md:hidden
              ml-auto

              text-[#9A9AAD]

              hover:text-white
              hover:bg-[#29293B]

              p-1.5

              rounded-md

              transition-colors
            "
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* =========================================
            MENU
        ========================================= */}

        <nav
          className={`
            flex-1

            overflow-y-auto
            no-scrollbar

            py-4

            ${
              isSidebarOpen
                ? "px-[10px]"
                : "px-[6px]"
            }
          `}
        >
          <div className="space-y-[5px]">
            {sidebarData.map((item, index) => {
              const Icon = item.icon;

              const activeParent =
                hasActiveChild(item);

              {/* =================================
                  SINGLE MENU
              ================================= */}

              if (!item.children) {
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    title={
                      !isSidebarOpen
                        ? item.title
                        : ""
                    }
                    className={({ isActive: active }) => `
                      h-[42px]

                      flex
                      items-center

                      rounded-[8px]

                      transition-all
                      duration-200

                      ${
                        isSidebarOpen
                          ? "px-[12px] gap-[12px]"
                          : "justify-center"
                      }

                      ${
                        active
                          ? `
                            bg-primary
                            text-white
                            shadow-sm
                          `
                          : `
                            text-[#D1D1DC]

                            hover:bg-[#29293B]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      className="
                        shrink-0
                      "
                    />

                    {isSidebarOpen && (
                      <span
                        className="
                          text-[13px]
                          font-medium
                          truncate
                        "
                      >
                        {item.title}
                      </span>
                    )}
                  </NavLink>
                );
              }

              {/* =================================
                  PARENT MENU
              ================================= */}

              return (
                <div key={index}>
                  <button
                    onClick={() =>
                      toggleMenu(index)
                    }
                    title={
                      !isSidebarOpen
                        ? item.title
                        : ""
                    }
                    className={`
                      w-full

                      h-[42px]

                      flex
                      items-center

                      rounded-[8px]

                      transition-all
                      duration-200

                      cursor-pointer

                      ${
                        isSidebarOpen
                          ? `
                            px-[12px]
                            gap-[12px]
                            justify-between
                          `
                          : "justify-center"
                      }

                      ${
                        openMenus[index] ||
                        activeParent
                          ? `
                            bg-primary
                            text-white
                          `
                          : `
                            text-[#D1D1DC]

                            hover:bg-[#29293B]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    <div
                      className={`
                        flex
                        items-center

                        ${
                          isSidebarOpen
                            ? "gap-[12px]"
                            : ""
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        className="
                          shrink-0
                        "
                      />

                      {isSidebarOpen && (
                        <span
                          className="
                            text-[13px]
                            font-medium
                            truncate
                          "
                        >
                          {item.title}
                        </span>
                      )}
                    </div>

                    {isSidebarOpen && (
                      <RiArrowDownSLine
                        size={18}
                        className={`
                          shrink-0

                          transition-transform
                          duration-200

                          ${
                            openMenus[index]
                              ? "rotate-180 text-white"
                              : "text-[#858597]"
                          }
                        `}
                      />
                    )}
                  </button>

                  {/* =================================
                      SUBMENU
                  ================================= */}

                  <div
                    className={`
                      overflow-hidden

                      transition-all
                      duration-300
                      ease-in-out

                      ${
                        openMenus[index] &&
                        isSidebarOpen
                          ? `
                            max-h-[600px]
                            opacity-100
                          `
                          : `
                            max-h-0
                            opacity-0
                          `
                      }
                    `}
                  >
                    <div
                      className="
                        ml-[18px]
                        pl-[13px]

                        border-l
                        border-[#3A3A50]

                        py-[5px]

                        space-y-[2px]
                      "
                    >
                      {item.children.map(
                        (sub, subIndex) => (
                          <NavLink
                            key={subIndex}
                            to={sub.path}
                            className={({
                              isActive: active,
                            }) => `
                              h-[35px]

                              flex
                              items-center

                              px-[9px]

                              rounded-[6px]

                              text-[12px]

                              transition-all
                              duration-200

                              ${
                                active
                                  ? `
                                    bg-primary/70
                                    text-white
                                    font-medium
                                  `
                                  : `
                                    text-[#B0B0C0]

                                    hover:bg-[#29293B]
                                    hover:text-white
                                  `
                              }
                            `}
                          >
                            <span
                              className={`
                                w-[5px]
                                h-[5px]

                                rounded-full

                                mr-[9px]

                                shrink-0

                                ${
                                  isActive(
                                    sub.path
                                  )
                                    ? "bg-white"
                                    : "bg-[#707087]"
                                }
                              `}
                            />

                            <span className="truncate">
                              {sub.title}
                            </span>
                          </NavLink>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* =========================================
            USER FOOTER
        ========================================= */}

        <div
          className={`
            shrink-0

            border-t
            border-[#303044]

            p-2

            ${
              isSidebarOpen
                ? "px-[10px]"
                : "flex justify-center"
            }
          `}
        >
          <div
            className={`
              flex
              items-center

              rounded-[8px]

              bg-[#272738]

              h-[46px]

              ${
                isSidebarOpen
                  ? "px-[8px] gap-[10px]"
                  : "px-[5px] justify-center"
              }
            `}
          >
            {/* Avatar */}

            <div
              className="
                w-[30px]
                h-[30px]

                rounded-full

                bg-primary

                text-white

                flex
                items-center
                justify-center

                text-[9px]
                font-bold

                shrink-0
              "
            >
              RK
            </div>

            {/* User Info */}

            {isSidebarOpen && (
              <div className="min-w-0">
                <p
                  className="
                    text-[11px]
                    text-white
                    font-semibold
                    truncate
                  "
                >
                  Rohit Kumar
                </p>

                <p
                  className="
                    text-[9px]
                    text-[#9090A3]
                    truncate
                    mt-[2px]
                  "
                >
                  Administrator
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;