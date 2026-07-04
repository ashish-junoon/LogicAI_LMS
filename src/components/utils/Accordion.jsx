import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";

const Accordion = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  onToggle,
  open
}) => {

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-slate-50 transition"
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icon className="text-blue-600 text-lg" />
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {title}
            </h3>

            {subtitle && (
              <p className="text-xs text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {actions && actions}

          <button
            onClick={onToggle}
            type="button"
            className="h-9 w-9 rounded-lg hover:bg-slate-200 flex items-center justify-center transition"
          >
            <RiArrowDownSLine
              className={`text-2xl transition-transform duration-300 cursor-pointer ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;