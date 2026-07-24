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
      title: "Lead Management",
      icon: FaMoneyBillTransfer,
      children: [
        { title: "Pending Leads", path: "/leads-pending" },
        { title: "New Leads", path: "/leads-new" },
        { title: "Credit Analysis", path: "/leads-assesment" },
        { title: "Kyc Verification", path: "/leads-kyc" },
        // { title: "Apply Loan", path: "/apply-loan" },
        // { title: "All Loans", path: "/all-loans" },
        // { title: "Loan Approval", path: "/loan-approval" },
        { title: "Disbursement", path: "/leads-disbursement" },
        // { title: "Active Loans", path: "/active-loan" },
        // { title: "Closed Loans", path: "/closed-loans" },
        { title: "Rejected Lead", path: "/leads-rejected" },
      ],
    },
    {
      title: "EMI Collection",
      icon: RiBankCard2Line,
      children: [
        { title: "Advance EMI", path: "/advance-emi" },
      ],
    },
    {
      title: "Master",
      icon: IoSettings,
      children: [
        { title: "Branches", path: "/branches" },
        { title: "Branch Managers", path: "/branch-managers" },
        { title: "Financial Years", path: "/finance-years" },
        { title: "Relationships", path: "/relationships" },
        { title: "State Master", path: "/state-list" },
        { title: "City Master", path: "/city-list" },
        { title: "Occupations", path: "/occupations" },
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
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-screen w-64 bg-[#050913] border-r border-[#1e293b] shadow-2xl flex flex-col
        transform transition-all duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#1e293b]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 8H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 12H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 16H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">
                LMS PANEL
              </h2>
              <p className="text-[10px] text-slate-400">Loan Management System</p>
            </div>
          </div>

          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="md:hidden p-1.5 rounded-lg hover:bg-[#1e293b] transition"
          >
            <RiCloseLine size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 no-scrollbar">
          {sidebarData.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index}>
                {item.children ? (
                  <>
                    {/* Parent Menu Item */}
                    <div
                      onClick={() => toggleMenu(index)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group
                        ${openMenus[index]
                          ? "bg-[#1e293b] text-white shadow-sm"
                          : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={`${openMenus[index] ? "text-white" : "text-slate-500 group-hover:text-indigo-400"} transition-colors`}
                        />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <RiArrowDownSLine
                        className={`transition-transform duration-200 ${openMenus[index] ? "rotate-180 text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                          }`}
                        size={16}
                      />
                    </div>

                    {/* Submenu */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openMenus[index] ? "max-h-96" : "max-h-0"
                        }`}
                    >
                      <div className="ml-9 mt-1 space-y-0.5 border-l-2 border-indigo-600/20 pl-3">
                        {item.children.map((sub, i) => (
                          <NavLink
                            key={i}
                            to={sub.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive: navActive }) =>
                              `block px-3 py-2 rounded-lg text-sm transition-all duration-200
                              ${navActive
                                ? "bg-primary text-white font-medium"
                                : "text-slate-400 hover:text-indigo-400 hover:bg-[#1e293b]"
                              }`
                            }
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${isActive(sub.path) ? "bg-white" : "bg-slate-600"
                                  }`}
                              />
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
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 group
                      ${navActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                      }`
                    }
                  >
                    <Icon
                      size={18}
                      className={`${isActive(item.path)
                        ? "text-white"
                        : "text-slate-500 group-hover:text-indigo-400"
                        } transition-colors`}
                    />
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e293b]">
          <p className="text-[10px] text-slate-500 text-center font-medium">
            © 2026 Powered by LogicAI Tech.
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;