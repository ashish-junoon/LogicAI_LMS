// import { Outlet, useLocation } from "react-router-dom";
// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// const Layout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const location = useLocation();

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50/80">
//       {/* Sidebar */}
//       <Sidebar 
//         isMobileOpen={isMobileOpen} 
//         setIsMobileOpen={setIsMobileOpen}
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen}
//       />

//       {/* Right Section */}
//       <div className="flex flex-col flex-1 min-w-0">
//         {/* Navbar */}
//         <Navbar 
//           setIsMobileOpen={setIsMobileOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//           isSidebarOpen={isSidebarOpen}
//         />

//         {/* Main Content */}
//         <div className={`flex-1 ${location.pathname !== "/" && "p-4 md:p-6"} overflow-y-auto overflow-x-hidden no-scrollbar`}>
//           <div className="max-w-7xl mx-auto">
//             <Outlet />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;



import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  // =====================================
  // DESKTOP SIDEBAR
  // =====================================
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true);

  // =====================================
  // MOBILE SIDEBAR
  // =====================================
  const [isMobileOpen, setIsMobileOpen] =
    useState(false);

  const location = useLocation();

  return (
    <div
      className="
        flex

        h-screen

        overflow-hidden

        bg-[#eef5f2]
      "
    >
      {/* ===================================
          SIDEBAR
      =================================== */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isSidebarOpen={isSidebarOpen}
      />

      {/* ===================================
          RIGHT SIDE
      =================================== */}
      <div
        className="
          flex
          flex-col

          flex-1

          min-w-0

          h-screen
        "
      >
        {/* =================================
            NAVBAR
        ================================= */}
        <Navbar
          setIsMobileOpen={setIsMobileOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />

        {/* =================================
            PAGE CONTENT
        ================================= */}
        <main
          className="
            flex-1

            overflow-y-auto
            overflow-x-hidden

            no-scrollbar

            bg-[#f0f0fc]
          "
        >
          <div
            className={`
              min-h-full

              ${
                location.pathname === "/"
                  ? ""
                  : `
                    px-0
                    py-3

                    md:px-3
                    md:py-3
                  `
              }
            `}
          >
            <div
              className="
                max-w-[1400px]
                mx-auto
              "
            >
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;