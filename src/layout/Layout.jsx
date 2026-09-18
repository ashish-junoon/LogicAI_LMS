// import { Outlet, useLocation } from "react-router-dom";
// import { useState } from "react";

// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// const Layout = () => {
//   // =====================================
//   // DESKTOP SIDEBAR
//   // =====================================
//   const [isSidebarOpen, setIsSidebarOpen] =
//     useState(true);

//   // =====================================
//   // MOBILE SIDEBAR
//   // =====================================
//   const [isMobileOpen, setIsMobileOpen] =
//     useState(false);

//   const location = useLocation();

//   return (
//     <div
//       className="
//         flex

//         h-screen

//         overflow-hidden

//         bg-[#eef5f2]
//       "
//     >
//       {/* ===================================
//           SIDEBAR
//       =================================== */}
//       <Sidebar
//         isMobileOpen={isMobileOpen}
//         setIsMobileOpen={setIsMobileOpen}
//         isSidebarOpen={isSidebarOpen}
//       />

//       {/* ===================================
//           RIGHT SIDE
//       =================================== */}
//       <div
//         className="
//           flex
//           flex-col

//           flex-1

//           min-w-0

//           h-screen
//         "
//       >
//         {/* =================================
//             NAVBAR
//         ================================= */}
//         <Navbar
//           setIsMobileOpen={setIsMobileOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//           isSidebarOpen={isSidebarOpen}
//         />

//         {/* =================================
//             PAGE CONTENT
//         ================================= */}
//         <main
//           className="
//             flex-1

//             overflow-y-auto
//             overflow-x-hidden

//             no-scrollbar

//             bg-[#f0f0fc]
//           "
//         >
//           <div
//             className={`
//               min-h-full

//               ${
//                 location.pathname === "/"
//                   ? ""
//                   : `
//                     px-0
//                     py-3

//                     md:px-3
//                     md:py-3
//                   `
//               }
//             `}
//           >
//             <div
//               className="
                
//                 mx-auto
//               "
//             >
//               <Outlet />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false); // desktop icon-only mode
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  const location = useLocation()  

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleSidebar={() => setCollapsed((v) => !v)}
      />

      <div className={`flex min-h-screen flex-col transition-all duration-200 ${collapsed ? "lg:pl-[76px]" : "lg:pl-64"}`}>
        <Navbar
          onToggleSidebar={() => setCollapsed((v) => !v)}
          onToggleMobile={() => setMobileOpen((v) => !v)}
        />
        <main className={`flex-1 ${location.pathname === "/" ? "p-0" : `p-2 lg:p-4`}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

