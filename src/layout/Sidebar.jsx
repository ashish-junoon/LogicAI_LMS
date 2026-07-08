import { useState } from "react";
import { RiArrowDownSLine, RiBankCard2Line, RiCloseLine } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";
import { RiDashboardLine, RiUser3Line, RiSettings3Line } from "react-icons/ri";
import { IoBookmarksOutline, IoTicketOutline, IoMailOpenOutline, IoSettings } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const sidebarData = [
    {
      title: "Dashboard",
      path: "/",
      icon: RiDashboardLine,
    },
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
      icon: FaMoneyBillTransfer,
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
          title: "Loan Approval",
          path: "/loan-approval",
        },
        {
          title: "Disbursement",
          path: "/disbursement",
        },
        {
          title: "Active Loans",
          path: "/active-loan",
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
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-30 h-screen w-65 bg-linear-to-b
        from-blue-0 to-blue-100 text-blue-300 flex flex-col
        transform transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow">
              L
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Loan Management
              </h2>
              <p className="text-xs text-slate-500">
                Admin Portal
              </p>
            </div>
          </div>

          <button className="md:hidden">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1.5 no-scrollbar">
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
                        ${openMenus[index]
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                    : "text-blue-800 hover:bg-blue-800/10 hover:text-blue-950"
                        }`}
                    >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={`${openMenus[index] ? "text-blue-900" : "text-blue-800"
                          }`}
                      />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <RiArrowDownSLine
                      className={`transition-transform duration-200 ${openMenus[index] ? "rotate-180 text-blue-900" : "text-blue-800"
                        }`}
                      size={16}
                    />
                  </div>

                {/* Submenu */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${openMenus[index] ? "max-h-96" : "max-h-0"
                    }`}
                >
                  <div className="ml-9 mt-0.5 space-y-0.5 pt-1 border-l border-blue-700/30 pl-3">
                    {item.children.map((sub, i) => (
                      <NavLink
                        key={i}
                        to={sub.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive: navActive }) =>
                          `block px-3 py-2 rounded-lg text-sm transition-all duration-200
                              ${navActive
                            ? "bg-blue-900/10 text-blue-900 font-medium"
                            : "text-blue-600 hover:text-blue-700 hover:font-semibold hover:bg-blue-800/10"
                          }`
                        }
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-1 h-1 rounded-full ${isActive(sub.path) ? "bg-blue-900" : "bg-blue-600"
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
                      ${navActive
                ? "bg-blue-200/50 text-blue-800"
                : "text-blue-800 hover:bg-blue-800/10 hover:text-blue-900"
              }`
            }
          >
            <Icon
    size={18}
    className={isActive(item.path)
        ? "text-blue-600"
        : "text-slate-500 group-hover:text-blue-600"}
/>
            <span className="font-medium">{item.title}</span>
          </NavLink>
                )}
        </div>
        );
          })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800 text-xs text-blue-400 text-center font-medium">
        © 2026 Powered by LogicAI Tech.
      </div>
    </div >
    </>
  );
};

export default Sidebar;