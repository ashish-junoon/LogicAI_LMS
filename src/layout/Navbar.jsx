import { useState } from "react";
import { FiMenu, FiSearch, FiBell, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { useAuthData } from "../context/authContext";

export default function Navbar({ onToggleSidebar, onToggleMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthData();
  const displayName = user?.full_name || "User";
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-surface-border bg-white px-4 lg:px-6">
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
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-400">{user?.role || ""}</p>
            </div>
            <FiChevronDown size={14} className="hidden text-gray-400 sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-surface-border bg-white py-1 shadow-card">
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-surface cursor-pointer">
                  <FiUser size={15} /> My Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-surface cursor-pointer"
                >
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
