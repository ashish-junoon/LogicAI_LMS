import { useState } from "react";
import { RiArrowDownSLine, RiCloseLine } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";
import { RiDashboardLine, RiUser3Line, RiSettings3Line } from "react-icons/ri";
import { IoBookmarksOutline, IoTicketOutline, IoMailOpenOutline, IoSettings } from "react-icons/io5";
import { MdHistory } from "react-icons/md";

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const sidebarData = [
    {
      title: "Dashboard",
      path: "/",
      icon: RiDashboardLine,
    },
    // {
    //   title: "Customer Management",
    //   icon: RiUser3Line,
    //   children: [
    //     {
    //       title: "Customers",
    //       path: "/customers",
    //     },
    //     {
    //       title: "Add Customer",
    //       path: "/customers/add",
    //     },
    //     {
    //       title: "KYC Verification",
    //       path: "/kyc",
    //     },
    //   ],
    // },
    {
      title: "Loan Management",
      icon: IoBookmarksOutline,
      children: [
        {
          title: "Apply Loan",
          path: "/apply-loan",
        },
        {
          title: "All Loans",
          path: "/all-loans",
        },
        {
          title: "Approved Loans",
          path: "/loan-approval",
        },
        {
          title: "Loan Approval",
          path: "/loan-approval",
        },
        {
          title: "Disbursement",
          path: "/disbursement",
        },
        {
          title: "Closed Loans",
          path: "/closed-loans",
        },
        {
          title: "Rejected Loans",
          path: "/rejected-loans",
        },
      ],
    },
    // {
    //   title: "Collections",
    //   icon: RiDashboardLine,
    //   children: [
    //     {
    //       title: "EMI Collection",
    //       path: "/emi-collection",
    //     },
    //     {
    //       title: "Recovery",
    //       path: "/recovery",
    //     },
    //     {
    //       title: "Overdue Loans",
    //       path: "/overdue-loans",
    //     },
    //   ],
    // },
    // {
    //   title: "Loan Products",
    //   icon: IoBookmarksOutline,
    //   children: [
    //     {
    //       title: "Products",
    //       path: "/loan-products",
    //     },
    //     {
    //       title: "Interest Setup",
    //       path: "/interest-setup",
    //     },
    //     {
    //       title: "Charges",
    //       path: "/charges",
    //     },
    //   ],
    // },
    // {
    //   title: "Reports",
    //   icon: RiDashboardLine,
    //   children: [
    //     {
    //       title: "Loan Reports",
    //       path: "/loan-reports",
    //     },
    //     {
    //       title: "Collection Reports",
    //       path: "/collection-reports",
    //     },
    //     {
    //       title: "MIS Reports",
    //       path: "/mis-reports",
    //     },
    //   ],
    // },
    // {
    //   title: "Administration",
    //   icon: RiSettings3Line,
    //   children: [
    //     {
    //       title: "Users",
    //       path: "/users",
    //     },
    //     {
    //       title: "Roles & Permissions",
    //       path: "/roles",
    //     },
    //     {
    //       title: "Branches",
    //       path: "/branches",
    //     },
    //     {
    //       title: "Settings",
    //       path: "/settings",
    //     },
    //   ],
    // },
    {
      title: "Master",
      icon: IoSettings,
      children: [
        {
          title: "Branches",
          path: "/branches",
        },
        {
          title: "Branch Managers",
          path: "/branch-managers",
        },
        {
          title: "Finantial Years",
          path: "/finance-years",
        },
        {
          title: "Relationships",
          path: "/relationships",
        },
        {
          title: "State Master",
          path: "/state-list",
        },
        {
          title: "City Master",
          path: "/city-list",
        },
        {
          title: "Occupations",
          path: "/occupations",
        },
      ],
    },
  ];

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-screen w-[280px]
        bg-[#0f172a] text-gray-300 flex flex-col
        transform transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
          <h1 className="text-lg font-bold text-white tracking-wide">
            <span className="text-blue-500">LMS</span> System
          </h1>
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <RiCloseLine size={22} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5 no-scrollbar">
          {sidebarData.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index}>
                {item.children ? (
                  <>
                    {/* Parent Menu Item */}
                    <div
                      onClick={() => toggleMenu(index)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                        ${
                          openMenus[index]
                            ? "bg-gray-800/50 text-white"
                            : "text-gray-400 hover:bg-gray-800/30 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={`${
                            openMenus[index] ? "text-blue-500" : "text-gray-500"
                          }`}
                        />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <RiArrowDownSLine
                        className={`transition-transform duration-200 ${
                          openMenus[index] ? "rotate-180 text-blue-500" : "text-gray-500"
                        }`}
                        size={16}
                      />
                    </div>

                    {/* Submenu */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openMenus[index] ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="ml-9 mt-0.5 space-y-0.5 border-l border-gray-700/30 pl-3">
                        {item.children.map((sub, i) => (
                          <NavLink
                            key={i}
                            to={sub.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive: navActive }) =>
                              `block px-3 py-2 rounded-lg text-sm transition-all duration-200
                              ${
                                navActive
                                  ? "bg-blue-500/10 text-blue-500 font-medium"
                                  : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                              }`
                            }
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-1 h-1 rounded-full ${
                                  isActive(sub.path) ? "bg-blue-500" : "bg-gray-600"
                                }`}
                              ></span>
                              {sub.title}
                            </span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Single Menu Item (Dashboard) */
                  <NavLink
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive: navActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                      ${
                        navActive
                          ? "bg-gray-800/50 text-white"
                          : "text-gray-400 hover:bg-gray-800/30 hover:text-white"
                      }`
                    }
                  >
                    <Icon
                      size={18}
                      className={isActive(item.path) ? "text-blue-500" : "text-gray-500"}
                    />
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-xs text-gray-400 text-center font-medium">
          © 2026 Powered by LogicAI Tech.
        </div>
      </div>
    </>
  );
};

export default Sidebar;