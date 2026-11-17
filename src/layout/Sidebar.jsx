// import { useEffect, useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   FiChevronDown,
//   FiLogOut,
//   FiChevronLeft,
//   FiChevronRight,
// } from "react-icons/fi";

// import { sidebarData } from "../content/data";
// import officepulselogo2 from "../assets/img/officepulselogo2.png";
// import officepulsefav2 from "../assets/img/officepulsefav2.png";
// import { useAuthData } from "../context/authContext";

// export default function Sidebar({
//   collapsed,
//   mobileOpen,
//   onCloseMobile,
//   onToggleSidebar,
// }) {
//   const location = useLocation();
//   const { logout } = useAuthData();

//   // ---------------------------------------------------------
//   // Automatically open the group containing the active route
//   // ---------------------------------------------------------
//   // const [openGroups, setOpenGroups] = useState(() => {
//   //   const initial = {};

//   //   sidebarData.forEach((item) => {
//   //     if (
//   //       item.children?.some(
//   //         (child) => child.path === location.pathname
//   //       )
//   //     ) {
//   //       initial[item.title] = true;
//   //     }
//   //   });

//   //   return initial;
//   // });
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

//   // Keep active group open when route changes
//   // useEffect(() => {
//   //   sidebarData.forEach((item) => {
//   //     if (
//   //       item.children?.some(
//   //         (child) => child.path === location.pathname
//   //       )
//   //     ) {
//   //       setOpenGroups((prev) => ({
//   //         ...prev,
//   //         [item.title]: true,
//   //       }));
//   //     }
//   //   });
//   // }, [location.pathname]);

//   const toggleGroup = (title) => {
//     setOpenGroups((prev) => ({
//       ...prev,
//       [title]: !prev[title],
//     }));
//   };

//   const isGroupActive = (item) =>
//     item.children?.some((child) => child.path === location.pathname);

//   return (
//     <>
//       {/* =====================================================
//           MOBILE OVERLAY
//       ====================================================== */}
//       {mobileOpen && (
//         <div
//           className="
//             fixed inset-0 z-30
//             bg-slate-950/30
//             backdrop-blur-[2px]
//             lg:hidden
//           "
//           onClick={onCloseMobile}
//         />
//       )}

//       {/* =====================================================
//           SIDEBAR
//       ====================================================== */}
//       <aside
//         className={[
//           "fixed inset-y-0 left-0 z-40",
//           "flex flex-col",
//           "bg-white",
//           "border-r border-slate-200/80",
//           "shadow-[4px_0_24px_rgba(15,23,42,0.04)]",
//           "transition-all duration-300 ease-in-out",

//           // Desktop
//           collapsed ? "lg:w-[78px]" : "lg:w-[260px]",

//           // Mobile
//           mobileOpen
//             ? "w-[240px] translate-x-0"
//             : "-translate-x-full lg:translate-x-0",
//         ].join(" ")}
//       >
//         {/* =====================================================
//             BRAND
//         ====================================================== */}
//         <div
//           className={[
//             "relative flex h-[65px] shrink-0 items-center",
//             "border-b border-slate-200/80",
//             "bg-white",
//             collapsed ? "lg:justify-center px-3" : "px-5",
//           ].join(" ")}
//         >
//           {/* Full Logo */}
//           {!collapsed ? (
//             <div className="flex w-full items-center">
//               <img
//                 src={officepulselogo2}
//                 alt="OfficePulse"
//                 className="
//                   h-auto
//                   max-h-[42px]
//                   w-[140px]
//                   object-contain
//                   object-left
//                 "
//               />
//             </div>
//           ) : (
//             /* Favourite / Icon Logo */
//             <div
//               className="
//                 flex h-10 w-10
//                 items-center justify-center
//                 rounded-xl
//                 bg-[#f0f6ff]
//                 p-1.5
//               "
//             >
//               <img
//                 src={officepulsefav2}
//                 alt="OfficePulse"
//                 className="h-full w-full object-contain"
//               />
//             </div>
//           )}

//           {/* ===================================================
//               COLLAPSE BUTTON
//           ==================================================== */}
//           <button
//             type="button"
//             onClick={onToggleSidebar}
//             aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//             className="absolute -right-3.5 top-[50px] hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md
//               transition-all duration-200 hover:border-[#1558bd] hover:bg-[#1558bd] hover:text-white lg:flex cursor-pointer"
//           >
//             {collapsed ? (
//               <FiChevronRight size={15} />
//             ) : (
//               <FiChevronLeft size={15} />
//             )}
//           </button>
//         </div>

//         {/* =====================================================
//             USER PROFILE
//         ====================================================== */}
//         {!collapsed && (
//           <div className="mx-3 mt-3 flex items-center gap-3 rounded-xl bg-primary/30 px-3 py-3 border border-primary/10">
//             {/* Avatar */}
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-900 text-white shadow-sm">
//               <span className="text-sm font-bold">RK</span>
//             </div>

//             {/* User Info */}
//             <div className="min-w-0 leading-tight">
//               <p className="truncate text-[14px] font-semibold text-slate-800">
//                 Rohit Koli
//               </p>

//               <div className="mt-1 flex items-center gap-1.5">
//                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

//                 <p className="text-[9px] font-semibold text-slate-500">
//                   Administrator
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* =====================================================
//             MENU
//         ====================================================== */}
//         <nav className="flex-1 overflow-y-auto px-3 py-5 no-scrollbar">
//           {!collapsed && (
//             <div className="mb-3 flex items-center gap-2 px-3">
//               <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
//                 Menu
//               </span>

//               <div className="h-px flex-1 bg-slate-100" />
//             </div>
//           )}

//           <ul className="space-y-1.5">
//             {sidebarData.map((item) => {
//               const Icon = item.icon;

//               /* =================================================
//                  LEAF ITEM
//               ================================================== */
//               if (!item.children) {
//                 return (
//                   <li key={item.title}>
//                     <NavLink
//                       to={item.path}
//                       onClick={onCloseMobile}
//                       title={collapsed ? item.title : undefined}
//                       className={({ isActive }) =>
//                         [
//                           "group relative flex min-h-[44px]",
//                           "items-center rounded-lg",
//                           "text-[13.5px] font-medium",
//                           "transition-all duration-200",

//                           collapsed ? "lg:justify-center px-3" : "gap-3 px-3",

//                           isActive
//                             ? `
//                               bg-primary
//                               text-white
//                               shadow-[0_5px_14px_rgba(21,88,189,0.22)]
//                             `
//                             : `
//                               text-slate-600
//                               hover:bg-slate-50
//                               hover:text-primary
//                             `,
//                         ].join(" ")
//                       }
//                     >
//                       {({ isActive }) => (
//                         <>
//                           {/* Active indicator */}
//                           {isActive && (
//                             <span
//                               className="
//                                 absolute
//                                 left-0
//                                 h-6
//                                 w-1
//                                 rounded-r-full
//                                 bg-white
//                               "
//                             />
//                           )}

//                           <Icon
//                             size={20}
//                             className={[
//                               "shrink-0 transition-transform duration-200",
//                               !isActive && "group-hover:scale-105",
//                             ].join(" ")}
//                           />

//                           {!collapsed && (
//                             <span className="truncate">{item.title}</span>
//                           )}
//                         </>
//                       )}
//                     </NavLink>
//                   </li>
//                 );
//               }

//               /* =================================================
//                  GROUP ITEM
//               ================================================== */
//               const active = isGroupActive(item);

//               const open = collapsed ? false : !!openGroups[item.title];

//               return (
//                 <li key={item.title}>
//                   {/* Group Header */}
//                   <button
//                     type="button"
//                     onClick={() => toggleGroup(item.title)}
//                     title={collapsed ? item.title : undefined}
//                     className={[
//                       "group relative flex min-h-[44px]",
//                       "cursor-pointer",
//                       "w-full items-center rounded-lg",
//                       "text-[13.5px] font-medium",
//                       "transition-all duration-200",

//                       collapsed
//                         ? "lg:justify-center px-3"
//                         : "justify-between px-3",

//                       active
//                         ? "bg-primary text-white shadow-[0_5px_14px_rgba(21,88,189,0.18)]"
//                         : "text-slate-600 hover:bg-slate-50 hover:text-[#1558bd]",
//                     ].join(" ")}
//                   >
//                     {active && (
//                       <span
//                         className="
//                           absolute
//                           left-0
//                           h-6
//                           w-1
//                           rounded-r-full
//                           bg-white
//                         "
//                       />
//                     )}

//                     <span className="flex min-w-0 items-center gap-3">
//                       <Icon size={20} className="shrink-0" />

//                       {!collapsed && (
//                         <span className="truncate">{item.title}</span>
//                       )}
//                     </span>

//                     {!collapsed && (
//                       <FiChevronDown
//                         size={16}
//                         className={[
//                           "shrink-0",
//                           "transition-transform duration-200",
//                           open ? "rotate-180" : "",
//                         ].join(" ")}
//                       />
//                     )}
//                   </button>

//                   {/* =================================================
//                      CHILDREN
//                   ================================================== */}
//                   {!collapsed && (
//                     <div
//                       className={[
//                         "grid transition-all duration-200",
//                         open
//                           ? "grid-rows-[1fr] opacity-100"
//                           : "grid-rows-[0fr] opacity-0",
//                       ].join(" ")}
//                     >
//                       <div className="overflow-hidden">
//                         <ul
//                           className="
//                             relative
//                             ml-[22px]
//                             mt-1.5
//                             space-y-0.5
//                             border-l
//                             border-slate-200
//                             pl-4
//                           "
//                         >
//                           {item.children.map((child) => (
//                             <li key={child.path} className="relative">
//                               <NavLink
//                                 to={child.path}
//                                 onClick={onCloseMobile}
//                                 className={({ isActive }) =>
//                                   [
//                                     "relative flex items-center",
//                                     "min-h-[38px]",
//                                     "rounded-lg",
//                                     "px-3",
//                                     "text-[13px]",
//                                     "transition-all duration-150",

//                                     isActive
//                                       ? `
//                                           bg-[#edf4ff]
//                                           font-semibold
//                                           text-[#1558bd]
//                                         `
//                                       : `
//                                           text-slate-500
//                                           hover:bg-slate-50
//                                           hover:text-slate-800
//                                         `,
//                                   ].join(" ")
//                                 }
//                               >
//                                 {({ isActive }) => (
//                                   <>
//                                     {isActive && (
//                                       <span
//                                         className="
//                                             absolute
//                                             -left-[18px]
//                                             h-5
//                                             w-0.5
//                                             rounded-full
//                                             bg-[#1558bd]
//                                           "
//                                       />
//                                     )}

//                                     {child.title}
//                                   </>
//                                 )}
//                               </NavLink>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
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
//           className="
//             shrink-0
//             border-t border-slate-200/80
//             p-3
//           "
//         >
//           <button
//             type="button"
//             onClick={logout}
//             className={[
//               "group flex min-h-[46px] cursor-pointer",
//               "w-full items-center rounded-xl",
//               "text-[13px] font-bold",
//               "transition-all duration-200",

//               collapsed ? "lg:justify-center px-3" : "gap-3 px-3",

//               "bg-red-50",
//               "text-red-500",
//               "hover:bg-red-100",
//               "hover:text-red-600",
//             ].join(" ")}
//           >
//             <FiLogOut
//               size={20}
//               className="
//                 shrink-0
//                 transition-transform
//                 duration-200
//                 group-hover:-translate-x-0.5
//               "
//             />

//             {!collapsed && <span className="tracking-wide">Sign Out</span>}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

// Dynamic Sidebar

import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  FiChevronDown,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiFolder,
} from "react-icons/fi";

import { sidebarData } from "../content/data";
import officepulselogo2 from "../assets/img/officepulselogo2.png";
import officepulsefav2 from "../assets/img/officepulsefav2.png";
import { useAuthData } from "../context/authContext";
import { GetPagePermission } from "../api/userApi";

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleSidebar,
}) {
  const location = useLocation();

  const { authData, logout, permissions } = useAuthData();

  const user_id = authData?.user_id;

  // const [permissions, setPermissions] = useState([]);
  const [openGroups, setOpenGroups] = useState({});

  // ---------------------------------------------------------
  // Normalize URL
  // ---------------------------------------------------------
  const normalizePath = (path = "") => {
    const normalized = `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "");

    return normalized || "/";
  };

  // ---------------------------------------------------------
  // Fetch Page Permissions
  // ---------------------------------------------------------
  useEffect(() => {
    if (user_id) {
      // fetchPermissions();
    }
  }, [user_id]);

  const fetchPermissions = async () => {
    try {
      const response = await GetPagePermission({
        user_id: "",
        login_user: user_id,
        page_name_type: "LMS",
      });

      // Support both direct API response and Axios response
      const responseData =
        response?.data?.data ??
        response?.data ??
        response?.getPermissions ??
        [];

      // Only pages with set_permission_access === true
      const allowedPages = Array.isArray(responseData)
        ? responseData.sort(
            (a, b) =>
              (a.group_display_index || 0) - (b.group_display_index || 0) ||
              (a.page_display_index || 0) - (b.page_display_index || 0),
          )
        : [];

      setPermissions(allowedPages);
    } catch (error) {
      console.error("Page Permission Error:", error);
      setPermissions([]);
    }
  };

  // ---------------------------------------------------------
  // Find Existing Sidebar Icons
  // ---------------------------------------------------------
  const findExistingGroup = (groupName) => {
    return sidebarData.find(
      (item) =>
        item.title?.trim().toLowerCase() === groupName?.trim().toLowerCase(),
    );
  };

  const findExistingPage = (pageUrl) => {
    return sidebarData
      .flatMap((item) => [
        ...(item.children || []),
        ...(!item.children ? [item] : []),
      ])
      .find((item) => normalizePath(item.path) === normalizePath(pageUrl));
  };

  // ---------------------------------------------------------
  // Convert API Data into Sidebar Groups
  // ---------------------------------------------------------
  const dynamicSidebarData = Object.values(
    permissions.reduce((groups, page) => {
      const groupKey = page.group_id;

      if (!groups[groupKey]) {
        const existingGroup = findExistingGroup(page.group_display_name);

        groups[groupKey] = {
          id: groupKey,
          title: page.group_display_name,
          icon: existingGroup?.icon || FiFolder,
          displayIndex: page.group_display_index || 0,
          children: [],
        };
      }

      const existingPage = findExistingPage(page.page_url);

      groups[groupKey].children.push({
        pageId: page.page_id,
        title: page.page_display_name,
        path: normalizePath(page.page_url),
        icon: existingPage?.icon,
        set_permission_access: page.set_permission_access,
        r_w_permission: page.r_w_permission,
      });

      return groups;
    }, {}),
  ).sort((a, b) => a.group_display_index - b.group_display_index);

  // ---------------------------------------------------------
  // Toggle Sidebar Group
  // ---------------------------------------------------------
  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // ---------------------------------------------------------
  // Check Active Group
  // ---------------------------------------------------------
  const isGroupActive = (item) =>
    item.children?.some(
      (child) => normalizePath(child.path) === normalizePath(location.pathname),
    );

  // ---------------------------------------------------------
  // Check Direct Dashboard Link
  // Only Dashboard + exactly one permitted page
  // ---------------------------------------------------------
  const isSingleDashboardPage = (item) =>
    item.title?.trim().toLowerCase() === "dashboard" &&
    item.children?.length === 1;

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
          collapsed ? "lg:w-[78px]" : "lg:w-[260px]",

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
            collapsed ? "lg:justify-center px-3" : "px-5",
          ].join(" ")}
        >
          {/* Full Logo */}
          {!collapsed ? (
            <div className="flex w-full items-center">
              <img
                src={officepulselogo2}
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
                src={officepulsefav2}
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
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="
              absolute -right-3.5 top-[50px]
              hidden h-7 w-7 items-center justify-center
              rounded-full border border-slate-200
              bg-white text-slate-500 shadow-md
              transition-all duration-200
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
              mx-3 mt-3 flex items-center gap-3
              rounded-xl bg-primary/30 px-3 py-3
              border border-primary/10
            "
          >
            {/* Avatar */}
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full
                bg-gradient-to-br from-primary to-primary-900
                text-white shadow-sm
              "
            >
              <span className="text-sm font-bold">
                {authData?.full_name
                  ?.split(" ")
                  .map((name) => name[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "U"}
              </span>
            </div>

            {/* User Info */}
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[14px] font-semibold text-slate-800">
                {authData?.full_name || "User"}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <p className="text-[9px] font-semibold text-slate-500">
                  {authData?.role || ""}
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
            {dynamicSidebarData.map((item) => {
              const Icon = item.icon || FiFolder;
              const active = isGroupActive(item);

              // Only Dashboard with exactly one page
              // will render as a direct NavLink.
              if (isSingleDashboardPage(item)) {
                const page = item.children[0];

                return (
                  <li key={item.id}>
                    <NavLink
                      to={page.path}
                      onClick={onCloseMobile}
                      title={collapsed ? page.title : undefined}
                      className={({ isActive }) =>
                        [
                          "group relative flex min-h-[44px]",
                          "w-full items-center rounded-lg",
                          "text-[13.5px] font-medium",
                          "transition-all duration-200",

                          collapsed ? "lg:justify-center px-3" : "gap-3 px-3",

                          isActive
                            ? "bg-primary text-white shadow-[0_5px_14px_rgba(21,88,189,0.18)]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#1558bd]",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span
                              className="
                                absolute left-0
                                h-6 w-1 rounded-r-full
                                bg-white
                              "
                            />
                          )}

                          <Icon size={20} className="shrink-0" />

                          {!collapsed && (
                            <span className="truncate">{page.title}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              }

              // All other groups remain dropdowns
              const open = collapsed ? false : !!openGroups[item.title];

              return (
                <li key={item.id}>
                  {/* Group Header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.title)}
                    title={collapsed ? item.title : undefined}
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
                          absolute left-0
                          h-6 w-1 rounded-r-full
                          bg-white
                        "
                      />
                    )}

                    <span className="flex min-w-0 items-center gap-3">
                      <Icon size={20} className="shrink-0" />

                      {!collapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </span>

                    {!collapsed && (
                      <FiChevronDown
                        size={16}
                        className={[
                          "shrink-0",
                          "transition-transform duration-200",
                          open ? "rotate-180" : "",
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
                          {item.children.map((child) => (
                            <li key={child.pageId} className="relative">
                              <NavLink
                                to={child.path}
                                onClick={onCloseMobile}
                                className={({ isActive }) =>
                                  [
                                    "relative flex items-center",
                                    "min-h-[38px]",
                                    "rounded-lg",
                                    "px-3",
                                    "text-[13px]",
                                    "transition-all duration-150",

                                    isActive
                                      ? "bg-[#edf4ff] font-semibold text-[#1558bd]"
                                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
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
                          ))}
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
            onClick={logout}
            className={[
              "group flex min-h-[46px] cursor-pointer",
              "w-full items-center rounded-xl",
              "text-[13px] font-bold",
              "transition-all duration-200",

              collapsed ? "lg:justify-center px-3" : "gap-3 px-3",

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

            {!collapsed && <span className="tracking-wide">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
