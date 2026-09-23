// import { useEffect, useState } from "react";

// import {
//   RiArrowDownSLine,
//   RiCloseLine,
//   RiDashboardLine,
//   RiBankCard2Line,
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

//   // =========================================
//   // SIDEBAR MENU DATA
//   // =========================================

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
//         {
//           title: "Draft Leads",
//           path: "/leads-draft",
//         },
//         {
//           title: "New Leads",
//           path: "/leads-new",
//         },
//         {
//           title: "Credit Analysis",
//           path: "/leads-assesment",
//         },
//         {
//           title: "Kyc Verification",
//           path: "/leads-kyc",
//         },
//         {
//           title: "Disbursement",
//           path: "/leads-disbursement",
//         },
//         {
//           title: "Rejected Lead",
//           path: "/leads-rejected",
//         },
//       ],
//     },

//     {
//       title: "Loan Management",
//       icon: FaMoneyBillTransfer,
//       children: [
//         {
//           title: "All Loans",
//           path: "/loan-all",
//         },
//       ],
//     },

//     {
//       title: "EMI Collection",
//       icon: RiBankCard2Line,
//       children: [
//         {
//           title: "Advance EMI",
//           path: "/advance-emi",
//         },
//       ],
//     },

//     {
//       title: "Leads Center",
//       icon: FaRegObjectUngroup,
//       children: [
//         {
//           title: "All Product Leads",
//           path: "/all-leads",
//         },
//       ],
//     },

//     {
//       title: "Master",
//       icon: IoSettings,
//       children: [
//         {
//           title: "Loan Product",
//           path: "/product-master",
//         },
//         {
//           title: "Branches",
//           path: "/branches-master",
//         },
//         {
//           title: "Branch Managers",
//           path: "/branch-managers-master",
//         },
//         {
//           title: "Financial Years",
//           path: "/finance-years-master",
//         },
//         {
//           title: "Relationships",
//           path: "/relationships-master",
//         },
//         {
//           title: "State Master",
//           path: "/state-master",
//         },
//         {
//           title: "City Master",
//           path: "/city-master",
//         },
//         {
//           title: "Occupations",
//           path: "/occupations-master",
//         },
//         {
//           title: "Designation Master",
//           path: "/designation-master",
//         },
//         {
//           title: "PD Question Master",
//           path: "/quetionare-master",
//         },
//         {
//           title: "Page Master",
//           path: "/page-master",
//         },
//         {
//           title: "Vendor Master",
//           path: "/vendor-master",
//         },
//       ],
//     },
//   ];

//   // =========================================
//   // CLOSE MOBILE SIDEBAR ON ROUTE CHANGE
//   // =========================================

//   useEffect(() => {
//     if (isMobileOpen) {
//       setIsMobileOpen(false);
//     }
//   }, [location.pathname]);

//   // =========================================
//   // AUTO OPEN ACTIVE SUBMENU
//   // =========================================

//   useEffect(() => {
//     const activeMenus = {};

//     sidebarData.forEach((item, index) => {
//       if (
//         item.children?.some(
//           (child) => child.path === location.pathname
//         )
//       ) {
//         activeMenus[index] = true;
//       }
//     });

//     setOpenMenus((prev) => ({
//       ...prev,
//       ...activeMenus,
//     }));
//   }, [location.pathname]);

//   // =========================================
//   // TOGGLE SUBMENU
//   // =========================================

//   const toggleMenu = (index) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   // =========================================
//   // CHECK ACTIVE ROUTE
//   // =========================================

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   // =========================================
//   // CHECK ACTIVE CHILD
//   // =========================================

//   const hasActiveChild = (item) => {
//     return item.children?.some(
//       (child) => child.path === location.pathname
//     );
//   };

//   return (
//     <>
//       {/* =========================================
//           MOBILE OVERLAY
//       ========================================= */}

//       {isMobileOpen && (
//         <div
//           onClick={() => setIsMobileOpen(false)}
//           className="
//             fixed
//             inset-0
//             z-40

//             bg-slate-900/30
//             backdrop-blur-[2px]

//             md:hidden
//           "
//         />
//       )}

//       {/* =========================================
//           SIDEBAR
//       ========================================= */}

//       <aside
//         className={`
//           fixed
//           md:static

//           top-0
//           left-0

//           z-50

//           h-screen
//           shrink-0

//           bg-[#F8F8FC]
//           text-slate-700

//           border-r
//           border-[#E4E4EF]

//           flex
//           flex-col

//           shadow-[2px_0_14px_rgba(62,62,117,0.06)]

//           transition-all
//           duration-300
//           ease-in-out

//           ${
//             isMobileOpen
//               ? "translate-x-0"
//               : "-translate-x-full md:translate-x-0"
//           }

//           ${
//             isSidebarOpen
//               ? "w-[250px]"
//               : "w-[70px]"
//           }
//         `}
//       >
//         {/* =========================================
//             SIDEBAR HEADER
//         ========================================= */}

//         <div
//           className={`h-[60px] shrink-0 flex items-center bg-white ${
//               isSidebarOpen
//                 ? "px-4 justify-start"
//                 : "px-2 justify-center"
//             }
//           `}
//         >
//           <div
//             className="
//               flex
//               items-center
//               gap-3
//               min-w-0
//             "
//           >
//             {/* Logo */}

//             <div
//               className="
//                 w-[36px]
//                 h-[36px]

//                 shrink-0

//                 rounded-[10px]

//                 bg-primary

//                 flex
//                 items-center
//                 justify-center

//                 shadow-[0_5px_14px_rgba(62,62,117,0.22)]
//               "
//             >
//               <span
//                 className="
//                   text-white
//                   font-bold
//                   text-[12px]
//                   tracking-tight
//                 "
//               >
//                 OP
//               </span>
//             </div>

//             {/* Brand */}

//             {isSidebarOpen && (
//               <div className="min-w-0">
//                 <p
//                   className="
//                     text-[14px]
//                     font-bold

//                     text-primary

//                     whitespace-nowrap
//                     leading-none

//                     tracking-[0.2px]
//                   "
//                 >
//                   OFFICE PULSE
//                 </p>

//                 <p
//                   className="
//                     text-[9px]
//                     text-slate-400

//                     mt-[6px]

//                     whitespace-nowrap

//                     uppercase
//                     tracking-[1px]
//                   "
//                 >
//                   Loan Management
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Mobile Close Button */}

//           <button
//             onClick={() => setIsMobileOpen(false)}
//             className="
//               md:hidden

//               ml-auto

//               p-1.5

//               rounded-lg

//               text-slate-400

//               hover:text-primary/80
//               hover:bg-[#EEEEF7]

//               transition-all
//             "
//           >
//             <RiCloseLine size={20} />
//           </button>
//         </div>

//         {/* =========================================
//             MENU
//         ========================================= */}

//         <nav
//           className={`
//             flex-1

//             overflow-y-auto
//             no-scrollbar

//             py-5

//             ${
//               isSidebarOpen
//                 ? "px-[10px]"
//                 : "px-[7px]"
//             }
//           `}
//         >
//           {/* Section Label */}

//           {/* {isSidebarOpen && (
//             <div className="px-3 mb-3">
//               <p
//                 className="
//                   text-[9px]

//                   font-semibold

//                   uppercase

//                   tracking-[1.3px]

//                   text-[#9292A7]
//                 "
//               >
//                 Main Menu
//               </p>
//             </div>
//           )} */}

//           <div className="space-y-[3px]">
//             {sidebarData.map((item, index) => {
//               const Icon = item.icon;

//               const activeParent =
//                 hasActiveChild(item);

//               {/* =================================
//                   SINGLE MENU ITEM
//               ================================= */}

//               if (!item.children) {
//                 return (
//                   <NavLink
//                     key={index}
//                     to={item.path}
//                     title={
//                       !isSidebarOpen
//                         ? item.title
//                         : ""
//                     }
//                     className={({ isActive: active }) => `
//                       h-[44px]

//                       flex
//                       items-center

//                       rounded-[9px]

//                       transition-all
//                       duration-200

//                       ${
//                         isSidebarOpen
//                           ? "px-[12px] gap-[12px]"
//                           : "justify-center"
//                       }

//                       ${
//                         active
//                           ? `
//                             bg-primary
//                             text-white

//                             shadow-[0_4px_12px_rgba(62,62,117,0.20)]
//                           `
//                           : `
//                             text-[#626277]

//                             hover:bg-[#EEEEF7]
//                             hover:text-primary/80
//                           `
//                       }
//                     `}
//                   >
//                     <Icon
//                       size={19}
//                       className="shrink-0"
//                     />

//                     {isSidebarOpen && (
//                       <span
//                         className="
//                           text-[13px]
//                           font-medium
//                           truncate
//                         "
//                       >
//                         {item.title}
//                       </span>
//                     )}
//                   </NavLink>
//                 );
//               }

//               {/* =================================
//                   PARENT MENU
//               ================================= */}

//               return (
//                 <div key={index}>
//                   <button
//                     onClick={() =>
//                       toggleMenu(index)
//                     }
//                     title={
//                       !isSidebarOpen
//                         ? item.title
//                         : ""
//                     }
//                     className={`
//                       w-full

//                       h-[44px]

//                       flex
//                       items-center

//                       rounded-[9px]

//                       transition-all
//                       duration-200

//                       cursor-pointer

//                       ${
//                         isSidebarOpen
//                           ? `
//                             px-[12px]
//                             gap-[12px]
//                             justify-between
//                           `
//                           : "justify-center"
//                       }

//                       ${
//                         activeParent
//                           ? `
//                             bg-[#EEEEF7]
//                             text-primary
//                           `
//                           : `
//                             text-gray-800

//                             hover:bg-[#EEEEF7]
//                             hover:text-primary/80
//                           `
//                       }
//                     `}
//                   >
//                     <div
//                       className={`
//                         flex
//                         items-center

//                         ${
//                           isSidebarOpen
//                             ? "gap-[12px]"
//                             : ""
//                         }
//                       `}
//                     >
//                       <Icon
//                         size={19}
//                         className={`
//                           shrink-0

//                           ${
//                             activeParent
//                               ? "text-primary"
//                               : "text-[#85859A]"
//                           }
//                         `}
//                       />

//                       {isSidebarOpen && (
//                         <span
//                           className="
//                             text-[13px]
//                             font-medium
//                             truncate
//                           "
//                         >
//                           {item.title}
//                         </span>
//                       )}
//                     </div>

//                     {isSidebarOpen && (
//                       <RiArrowDownSLine
//                         size={18}
//                         className={`
//                           shrink-0

//                           text-[#9292A7]

//                           transition-transform
//                           duration-200

//                           ${
//                             openMenus[index]
//                               ? `
//                                 rotate-180
//                                 text-primary
//                               `
//                               : ""
//                           }
//                         `}
//                       />
//                     )}
//                   </button>

//                   {/* =================================
//                       SUBMENU
//                   ================================= */}

//                   <div
//                     className={`
//                       overflow-hidden

//                       transition-all
//                       duration-300
//                       ease-in-out

//                       ${
//                         openMenus[index] &&
//                         isSidebarOpen
//                           ? `
//                             max-h-[700px]
//                             opacity-100
//                           `
//                           : `
//                             max-h-0
//                             opacity-0
//                           `
//                       }
//                     `}
//                   >
//                     <div
//                       className="
//                         ml-[21px]

//                         pl-[12px]

//                         border-l
//                         border-[#DDDEEA]

//                         py-[5px]

//                         space-y-[2px]
//                       "
//                     >
//                       {item.children.map(
//                         (sub, subIndex) => (
//                           <NavLink
//                             key={subIndex}
//                             to={sub.path}
//                             className={({ isActive: active }) => `
//                               h-[36px]

//                               flex
//                               items-center

//                               px-[10px]

//                               rounded-[7px]

//                               text-[12px]

//                               transition-all
//                               duration-200

//                               ${
//                                 active
//                                   ? `
//                                     bg-[#EEEEF7]
//                                     text-primary
//                                     font-semibold
//                                   `
//                                   : `
//                                     text-[#707085]

//                                     hover:bg-[#F2F2F8]
//                                     hover:text-primary/80
//                                   `
//                               }
//                             `}
//                           >
//                             {/* Indicator */}

//                             <span
//                               className={`
//                                 w-[5px]
//                                 h-[5px]

//                                 rounded-full

//                                 mr-[10px]

//                                 shrink-0

//                                 transition-all

//                                 ${
//                                   isActive(
//                                     sub.path
//                                   )
//                                     ? `
//                                       bg-primary
//                                       scale-125
//                                     `
//                                     : `
//                                       bg-[#B9B9C9]
//                                     `
//                                 }
//                               `}
//                             />

//                             <span className="truncate">
//                               {sub.title}
//                             </span>
//                           </NavLink>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </nav>

//         {/* =========================================
//             USER FOOTER
//         ========================================= */}

//         <div
//           className={`
//             shrink-0

//             border-t
//             border-[#E7E7F0]

//             bg-white

//             p-[10px]

//             ${
//               !isSidebarOpen
//                 ? "flex justify-center"
//                 : ""
//             }
//           `}
//         >
//           <div
//             className={`
//               flex
//               items-center

//               rounded-[10px]

//               bg-[#F0F0F8]

//               border
//               border-[#E4E4EF]

//               h-[50px]

//               ${
//                 isSidebarOpen
//                   ? "px-[9px] gap-[10px]"
//                   : "px-[5px] justify-center"
//               }
//             `}
//           >
//             {/* Avatar */}

//             <div
//               className="
//                 w-[32px]
//                 h-[32px]

//                 rounded-full

//                 bg-primary

//                 text-white

//                 flex
//                 items-center
//                 justify-center

//                 text-[10px]
//                 font-bold

//                 shrink-0

//                 shadow-[0_3px_8px_rgba(62,62,117,0.18)]
//               "
//             >
//               RK
//             </div>

//             {/* User Information */}

//             {isSidebarOpen && (
//               <div className="min-w-0 flex-1">
//                 <p
//                   className="
//                     text-[11px]

//                     text-[#3E3E55]

//                     font-semibold

//                     truncate
//                   "
//                 >
//                   Rohit Kumar
//                 </p>

//                 <p
//                   className="
//                     text-[9px]

//                     text-[#9292A7]

//                     truncate

//                     mt-[3px]
//                   "
//                 >
//                   Administrator
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;




// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { FiChevronDown, FiLogOut } from "react-icons/fi";
// import { RiBankLine } from "react-icons/ri";
// import { sidebarData } from "../content/data";
// import officepulselogo from '../assets/img/officepulselogo.png'
// import officepulsefav from '../assets/img/officepulsefav.png'

// export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
//   const location = useLocation();

//   // Auto-expand whichever group contains the current route.
//   const [openGroups, setOpenGroups] = useState(() => {
//     const initial = {};
//     sidebarData.forEach((item) => {
//       if (item.children?.some((c) => c.path === location.pathname)) {
//         initial[item.title] = true;
//       }
//     });
//     return initial;
//   });

//   const toggleGroup = (title) =>
//     setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));

//   const isGroupActive = (item) =>
//     item.children?.some((c) => c.path === location.pathname);

//   return (
//     <>
//       {/* mobile scrim */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-gray-900/40 lg:hidden"
//           onClick={onCloseMobile}
//         />
//       )}

//       <aside
//         className={[
//           "fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-surface-border",
//           "transition-all duration-200 ease-in-out",
//           collapsed ? "lg:w-[76px]" : "lg:w-64",
//           mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
//         ].join(" ")}
//       >
//         {/* Brand */}
//         <div className="flex h-16 shrink-0 items-center gap-2 border-b border-surface-border px-4">
//           {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
//             <RiBankLine size={20} />
//           </div> */}
//           <div>
//             <img className="w-20" src={officepulsefav} alt="" />
//           </div>
//           {/* {!collapsed && (
//             <div className="min-w-0 leading-tight">
//               <p className="truncate text-sm font-semibold text-gray-900">
//                 Office Pulse
//               </p>
//               <p className="truncate text-xs text-gray-400">Loan Management</p>
//             </div>
//           )} */}
//           {!collapsed && (
//             <div className="min-w-0 leading-tight">
//               <img className="w-[95%] m-auto" src={officepulselogo} alt="" />
//             </div>
//           )}
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 overflow-y-auto px-2 py-3">
//           <ul className="space-y-1">
//             {sidebarData.map((item) => {
//               const Icon = item.icon;

//               // Leaf item (no children) — e.g. Dashboard
//               if (!item.children) {
//                 return (
//                   <li key={item.title}>
//                     <NavLink
//                       to={item.path}
//                       onClick={onCloseMobile}
//                       className={({ isActive }) =>
//                         [
//                           "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
//                           isActive
//                             ? "bg-primary-700 text-primary-50"
//                             : "text-gray-700 hover:bg-surface",
//                           collapsed ? "lg:justify-center" : "",
//                         ].join(" ")
//                       }
//                       title={collapsed ? item.title : undefined}
//                     >
//                       <Icon size={18} className="shrink-0" />
//                       {!collapsed && <span className="truncate">{item.title}</span>}
//                     </NavLink>
//                   </li>
//                 );
//               }

//               // Group with children
//               const active = isGroupActive(item);
//               const open = collapsed ? false : !!openGroups[item.title];

//               return (
//                 <li key={item.title}>
//                   <button
//                     type="button"
//                     onClick={() => toggleGroup(item.title)}
//                     className={[
//                       "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
//                       active ? "text-primary-700" : "text-gray-700 hover:bg-surface",
//                       collapsed ? "lg:justify-center" : "justify-between",
//                     ].join(" ")}
//                     title={collapsed ? item.title : undefined}
//                   >
//                     <span className="flex items-center gap-3">
//                       <Icon size={18} className="shrink-0" />
//                       {!collapsed && <span className="truncate">{item.title}</span>}
//                     </span>
//                     {!collapsed && (
//                       <FiChevronDown
//                         size={16}
//                         className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
//                       />
//                     )}
//                   </button>

//                   {!collapsed && open && (
//                     <ul className="mt-1 space-y-0.5 border-l border-surface-border pl-[27px]">
//                       {item.children.map((child) => (
//                         <li key={child.path}>
//                           <NavLink
//                             to={child.path}
//                             onClick={onCloseMobile}
//                             className={({ isActive }) =>
//                               [
//                                 "block rounded-md px-3 py-2 text-sm transition-colors",
//                                 isActive
//                                   ? "bg-primary-100/80 font-medium text-primary-700"
//                                   : "text-gray-500 hover:bg-surface hover:text-gray-900",
//                               ].join(" ")
//                             }
//                           >
//                             {child.title}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

        
//         {/* =====================================================
//             SIGN OUT
//         ====================================================== */}
//         <div
//           className={[
//             "shrink-0 border-t border-[#e8e8e8] p-4",
//             collapsed ? "lg:px-3" : "",
//           ].join(" ")}
//         >
//           <button
//             type="button"
//             className={[
//               "flex min-h-[49px] w-full items-center rounded-lg",
//               "bg-[#fff4f4]",
//               "text-[#d85b5b]",
//               "transition-colors hover:bg-[#ffeaea]",
//               collapsed
//                 ? "lg:justify-center px-3"
//                 : "gap-4 px-4",
//             ].join(" ")}
//           >
//             <FiLogOut
//               size={21}
//               strokeWidth={1.8}
//               className="shrink-0"
//             />

//             {!collapsed && (
//               <span className="text-[14px] font-bold tracking-wide">
//                 SIGN OUT
//               </span>
//             )}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }



// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { FiChevronDown, FiLogOut } from "react-icons/fi";
// import { RiBankLine } from "react-icons/ri";
// import { sidebarData } from "../content/data";
// import officepulselogo from '../assets/img/officepulselogo.png'
// import officepulsefav from '../assets/img/officepulsefav.png'

// export default function Sidebar({
//   collapsed,
//   mobileOpen,
//   onCloseMobile,
//   onToggleSidebar
// }) {
//   const location = useLocation();

//   const [openGroups, setOpenGroups] = useState(() => {
//     const initial = {};

//     // sidebarData.forEach((item) => {
//     //   if (
//     //     item.children?.some(
//     //       (child) => child.path === location.pathname
//     //     )
//     //   ) {
//     //     initial[item.title] = true;
//     //   }
//     // });

//     return initial;
//   });

//   const toggleGroup = (title) => {
//     setOpenGroups((prev) => ({
//       ...prev,
//       [title]: !prev[title],
//     }));
//   };

//   const isGroupActive = (item) =>
//     item.children?.some(
//       (child) => child.path === location.pathname
//     );

//   return (
//     <>
//       {/* Mobile overlay */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-black/30 lg:hidden"
//           onClick={onCloseMobile}
//         />
//       )}

//       <aside
//         className={[
//           "fixed inset-y-0 left-0 z-40 flex flex-col",
//           "bg-white border-r border-[#e8e8e8]",
//           "transition-all duration-200 ease-in-out",

//           // Desktop width
//           collapsed ? "lg:w-[76px]" : "lg:w-64",

//           // Mobile
//           mobileOpen
//             ? "translate-x-0 w-[220px]"
//             : "-translate-x-full lg:translate-x-0",
//         ].join(" ")}
//       >
//         {/* =====================================================
//             BRAND
//         ====================================================== */}
//         <div
//           className={[
//             "relative flex h-[70px] shrink-0 items-center",
//             "border-b border-[#e8e8e8]",
//             collapsed
//               ? "lg:justify-center px-3"
//               : "px-5",
//           ].join(" ")}
//         >
//           {!collapsed ? (
//             <div className="flex items-center">
//               <img className="w-[80%] m-auto" src={officepulselogo} alt="" />
//             </div>
//           ) : (
//             // <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1254b8] text-white">
//             //   <RiBankLine size={20} />
//             // </div>

//             <div>
//               <img className="w-[70%] m-auto" src={officepulsefav} alt="" />
//             </div>
//           )}

//           {/* Collapse button */}
//           <button
//           onClick={onToggleSidebar}
//             type="button"
//             className="
//               absolute -right-[14px] top-[55px]
//               flex h-7 w-7 items-center justify-center
//               rounded-full bg-white
//               text-[#1554b5]
//               shadow-sm
//               border border-[#eeeeee]
//               hover:bg-gray-50
//               max-lg:hidden
//             "
//           >
//             <span className="text-lg leading-none">‹</span>
//           </button>
//         </div>

//         {/* =====================================================
//             USER
//         ====================================================== */}
//         {!collapsed && (
//           <div className="flex h-[60px] shrink-0 items-center gap-4 border-b border-[#e8e8e8] px-6">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full">
//               <svg
//                 width="35"
//                 height="35"
//                 viewBox="0 0 40 40"
//                 fill="none"
//               >
//                 <circle
//                   cx="20"
//                   cy="12"
//                   r="7"
//                   fill="#6B7280"
//                 />
//                 <path
//                   d="M8 35C8 27.268 13.373 23 20 23C26.627 23 32 27.268 32 35"
//                   fill="#6B7280"
//                 />
//               </svg>
//             </div>

//             <div className="leading-tight">
//               <p className="text-[15px] font-semibold text-[#30343b]">
//                 Rohit koli
//               </p>

//               <p className="text-[10px] font-semibold tracking-wide text-[#777b82]">
//                 SUPER USER
//               </p>
//             </div>
//           </div>
//         )}

//         {/* =====================================================
//             MENU
//         ====================================================== */}
//         <nav className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar">
//           {!collapsed && (
//             <p className="mb-3 px-2 text-[14px] font-semibold tracking-wide text-[#777b82]">
//               MENU
//             </p>
//           )}

//           <ul className="space-y-2">
//             {sidebarData.map((item) => {
//               const Icon = item.icon;

//               /* Leaf item */
//               if (!item.children) {
//                 return (
//                   <li key={item.title}>
//                     <NavLink
//                       to={item.path}
//                       onClick={onCloseMobile}
//                       title={collapsed ? item.title : undefined}
//                       className={({ isActive }) =>
//                         [
//                           "group flex min-h-[42px] items-center rounded-lg",
//                           "text-[14px] font-medium",
//                           "transition-all duration-150",

//                           collapsed
//                             ? "lg:justify-center px-3"
//                             : "gap-4 px-3",

//                           isActive
//                             ? "bg-primary text-white shadow-sm"
//                             : "text-[#656a72] hover:bg-[#f5f7fa]",
//                         ].join(" ")
//                       }
//                     >
//                       <Icon
//                         size={20}
//                         className="shrink-0"
//                       />

//                       {!collapsed && (
//                         <span className="truncate">
//                           {item.title}
//                         </span>
//                       )}
//                     </NavLink>
//                   </li>
//                 );
//               }

//               /* Group item */
//               const active = isGroupActive(item);
//               const open = collapsed
//                 ? false
//                 : !!openGroups[item.title];

//               return (
//                 <li key={item.title}>
//                   <button
//                     type="button"
//                     onClick={() => toggleGroup(item.title)}
//                     title={collapsed ? item.title : undefined}
//                     className={[
//                       "flex min-h-[42px] w-full items-center rounded-lg cursor-pointer",
//                       "text-[14px] font-medium",
//                       "transition-all duration-150",

//                       collapsed
//                         ? "lg:justify-center px-3"
//                         : "justify-between px-3",

//                       active
//                         ? "text-[#ffffff] bg-primary"
//                         : "text-[#656a72] hover:bg-[#f5f7fa]",
//                     ].join(" ")}
//                   >
//                     <span className="flex items-center gap-4">
//                       <Icon
//                         size={21}
//                         strokeWidth={1.8}
//                         className="shrink-0"
//                       />

//                       {!collapsed && (
//                         <span className="truncate">
//                           {item.title}
//                         </span>
//                       )}
//                     </span>

//                     {!collapsed && (
//                       <FiChevronDown
//                         size={16}
//                         className={[
//                           "transition-transform",
//                           open ? "rotate-180" : "",
//                         ].join(" ")}
//                       />
//                     )}
//                   </button>

//                   {!collapsed && open && (
//                     <ul className="ml-7 mt-1 space-y-1 border-l border-[#e5e7eb] pl-3">
//                       {item.children.map((child) => (
//                         <li key={child.path}>
//                           <NavLink
//                             to={child.path}
//                             onClick={onCloseMobile}
//                             className={({ isActive }) =>
//                               [
//                                 "block rounded-md px-3 py-2 text-sm",
//                                 "transition-colors",

//                                 isActive
//                                   ? "bg-[#e8f0ff] font-medium text-[#1558bd]"
//                                   : "text-[#777b82] hover:bg-[#f5f7fa]",
//                               ].join(" ")
//                             }
//                           >
//                             {child.title}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* =====================================================
//             SIGN OUT
//         ====================================================== */}
//         <div
//           className={[
//             "shrink-0 border-t border-[#e8e8e8] p-4",
//             collapsed ? "lg:px-3" : "",
//           ].join(" ")}
//         >
//           <button
//             type="button"
//             className={[
//               "flex min-h-[49px] w-full items-center rounded-lg",
//               "bg-[#fff4f4]",
//               "text-[#d85b5b]",
//               "transition-colors hover:bg-[#ffeaea]",
//               collapsed
//                 ? "lg:justify-center px-3"
//                 : "gap-4 px-4",
//             ].join(" ")}
//           >
//             <FiLogOut
//               size={21}
//               strokeWidth={1.8}
//               className="shrink-0"
//             />

//             {!collapsed && (
//               <span className="text-[14px] font-bold tracking-wide">
//                 SIGN OUT
//               </span>
//             )}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }



import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiChevronDown,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { sidebarData } from "../content/data";
import officepulselogo from "../assets/img/officepulselogo.png";
import officepulsefav from "../assets/img/officepulsefav.png";

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleSidebar,
}) {
  const location = useLocation();

  // ---------------------------------------------------------
  // Automatically open the group containing the active route
  // ---------------------------------------------------------
  // const [openGroups, setOpenGroups] = useState(() => {
  //   const initial = {};

  //   sidebarData.forEach((item) => {
  //     if (
  //       item.children?.some(
  //         (child) => child.path === location.pathname
  //       )
  //     ) {
  //       initial[item.title] = true;
  //     }
  //   });

  //   return initial;
  // });
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};

    // sidebarData.forEach((item) => {
    //   if (
    //     item.children?.some(
    //       (child) => child.path === location.pathname
    //     )
    //   ) {
    //     initial[item.title] = true;
    //   }
    // });

    return initial;
  });

  // Keep active group open when route changes
  // useEffect(() => {
  //   sidebarData.forEach((item) => {
  //     if (
  //       item.children?.some(
  //         (child) => child.path === location.pathname
  //       )
  //     ) {
  //       setOpenGroups((prev) => ({
  //         ...prev,
  //         [item.title]: true,
  //       }));
  //     }
  //   });
  // }, [location.pathname]);

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isGroupActive = (item) =>
    item.children?.some(
      (child) => child.path === location.pathname
    );

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {mobileOpen && (
        <div
          className="
            fixed inset-0 z-30
            bg-slate-950/30
            backdrop-blur-[2px]
            lg:hidden
          "
          onClick={onCloseMobile}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40",
          "flex flex-col",
          "bg-white",
          "border-r border-slate-200/80",
          "shadow-[4px_0_24px_rgba(15,23,42,0.04)]",
          "transition-all duration-300 ease-in-out",

          // Desktop
          collapsed
            ? "lg:w-[78px]"
            : "lg:w-[260px]",

          // Mobile
          mobileOpen
            ? "w-[240px] translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* =====================================================
            BRAND
        ====================================================== */}
        <div
          className={[
            "relative flex h-[65px] shrink-0 items-center",
            "border-b border-slate-200/80",
            "bg-white",
            collapsed
              ? "lg:justify-center px-3"
              : "px-5",
          ].join(" ")}
        >
          {/* Full Logo */}
          {!collapsed ? (
            <div className="flex w-full items-center">
              <img
                src={officepulselogo}
                alt="OfficePulse"
                className="
                  h-auto
                  max-h-[42px]
                  w-[140px]
                  object-contain
                  object-left
                "
              />
            </div>
          ) : (
            /* Favourite / Icon Logo */
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-[#f0f6ff]
                p-1.5
              "
            >
              <img
                src={officepulsefav}
                alt="OfficePulse"
                className="h-full w-full object-contain"
              />
            </div>
          )}

          {/* ===================================================
              COLLAPSE BUTTON
          ==================================================== */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="
              absolute
              -right-3.5
              top-[50px]
              hidden
              h-7 w-7
              items-center justify-center
              rounded-full
              border border-slate-200
              bg-white
              text-slate-500
              shadow-md
              transition-all
              duration-200
              hover:border-[#1558bd]
              hover:bg-[#1558bd]
              hover:text-white
              lg:flex cursor-pointer
            "
          >
            {collapsed ? (
              <FiChevronRight size={15} />
            ) : (
              <FiChevronLeft size={15} />
            )}
          </button>
        </div>

        {/* =====================================================
            USER PROFILE
        ====================================================== */}
        {!collapsed && (
          <div
            className="
              mx-3 mt-3
              flex items-center gap-3
              rounded-xl
              bg-primary/20
              px-3 py-3
              border border-slate-100
            "
          >
            {/* Avatar */}
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full
                bg-gradient-to-br
                from-primary
                to-primary-900
                text-white
                shadow-sm
              "
            >
              <span className="text-sm font-bold">
                RK
              </span>
            </div>

            {/* User Info */}
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[14px] font-semibold text-slate-800">
                Rohit Koli
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <p className="text-[9px] font-semibold text-slate-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MENU
        ====================================================== */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 no-scrollbar">
          {!collapsed && (
            <div className="mb-3 flex items-center gap-2 px-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Menu
              </span>

              <div className="h-px flex-1 bg-slate-100" />
            </div>
          )}

          <ul className="space-y-1.5">
            {sidebarData.map((item) => {
              const Icon = item.icon;

              /* =================================================
                 LEAF ITEM
              ================================================== */
              if (!item.children) {
                return (
                  <li key={item.title}>
                    <NavLink
                      to={item.path}
                      onClick={onCloseMobile}
                      title={
                        collapsed
                          ? item.title
                          : undefined
                      }
                      className={({ isActive }) =>
                        [
                          "group relative flex min-h-[44px]",
                          "items-center rounded-lg",
                          "text-[13.5px] font-medium",
                          "transition-all duration-200",

                          collapsed
                            ? "lg:justify-center px-3"
                            : "gap-3 px-3",

                          isActive
                            ? `
                              bg-primary
                              text-white
                              shadow-[0_5px_14px_rgba(21,88,189,0.22)]
                            `
                            : `
                              text-slate-600
                              hover:bg-slate-50
                              hover:text-primary
                            `,
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active indicator */}
                          {isActive && (
                            <span
                              className="
                                absolute
                                left-0
                                h-6
                                w-1
                                rounded-r-full
                                bg-white
                              "
                            />
                          )}

                          <Icon
                            size={20}
                            className={[
                              "shrink-0 transition-transform duration-200",
                              !isActive &&
                                "group-hover:scale-105",
                            ].join(" ")}
                          />

                          {!collapsed && (
                            <span className="truncate">
                              {item.title}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              }

              /* =================================================
                 GROUP ITEM
              ================================================== */
              const active = isGroupActive(item);

              const open = collapsed
                ? false
                : !!openGroups[item.title];

              return (
                <li key={item.title}>
                  {/* Group Header */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleGroup(item.title)
                    }
                    title={
                      collapsed
                        ? item.title
                        : undefined
                    }
                    className={[
                      "group relative flex min-h-[44px]",
                      "cursor-pointer",
                      "w-full items-center rounded-lg",
                      "text-[13.5px] font-medium",
                      "transition-all duration-200",

                      collapsed
                        ? "lg:justify-center px-3"
                        : "justify-between px-3",

                      active
                        ? "bg-primary text-white shadow-[0_5px_14px_rgba(21,88,189,0.18)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#1558bd]",
                    ].join(" ")}
                  >
                    {active && (
                      <span
                        className="
                          absolute
                          left-0
                          h-6
                          w-1
                          rounded-r-full
                          bg-white
                        "
                      />
                    )}

                    <span className="flex min-w-0 items-center gap-3">
                      <Icon
                        size={20}
                        className="shrink-0"
                      />

                      {!collapsed && (
                        <span className="truncate">
                          {item.title}
                        </span>
                      )}
                    </span>

                    {!collapsed && (
                      <FiChevronDown
                        size={16}
                        className={[
                          "shrink-0",
                          "transition-transform duration-200",
                          open
                            ? "rotate-180"
                            : "",
                        ].join(" ")}
                      />
                    )}
                  </button>

                  {/* =================================================
                     CHILDREN
                  ================================================== */}
                  {!collapsed && (
                    <div
                      className={[
                        "grid transition-all duration-200",
                        open
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      ].join(" ")}
                    >
                      <div className="overflow-hidden">
                        <ul
                          className="
                            relative
                            ml-[22px]
                            mt-1.5
                            space-y-0.5
                            border-l
                            border-slate-200
                            pl-4
                          "
                        >
                          {item.children.map(
                            (child) => (
                              <li
                                key={child.path}
                                className="relative"
                              >
                                <NavLink
                                  to={child.path}
                                  onClick={
                                    onCloseMobile
                                  }
                                  className={({
                                    isActive,
                                  }) =>
                                    [
                                      "relative flex items-center",
                                      "min-h-[38px]",
                                      "rounded-lg",
                                      "px-3",
                                      "text-[13px]",
                                      "transition-all duration-150",

                                      isActive
                                        ? `
                                          bg-[#edf4ff]
                                          font-semibold
                                          text-[#1558bd]
                                        `
                                        : `
                                          text-slate-500
                                          hover:bg-slate-50
                                          hover:text-slate-800
                                        `,
                                    ].join(" ")
                                  }
                                >
                                  {({ isActive }) => (
                                    <>
                                      {isActive && (
                                        <span
                                          className="
                                            absolute
                                            -left-[18px]
                                            h-5
                                            w-0.5
                                            rounded-full
                                            bg-[#1558bd]
                                          "
                                        />
                                      )}

                                      {child.title}
                                    </>
                                  )}
                                </NavLink>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* =====================================================
            SIGN OUT
        ====================================================== */}
        <div
          className="
            shrink-0
            border-t border-slate-200/80
            p-3
          "
        >
          <button
            type="button"
            className={[
              "group flex min-h-[46px]",
              "w-full items-center rounded-xl",
              "text-[13px] font-bold",
              "transition-all duration-200",

              collapsed
                ? "lg:justify-center px-3"
                : "gap-3 px-3",

              "bg-red-50",
              "text-red-500",
              "hover:bg-red-100",
              "hover:text-red-600",
            ].join(" ")}
          >
            <FiLogOut
              size={20}
              className="
                shrink-0
                transition-transform
                duration-200
                group-hover:-translate-x-0.5
              "
            />

            {!collapsed && (
              <span className="tracking-wide">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}