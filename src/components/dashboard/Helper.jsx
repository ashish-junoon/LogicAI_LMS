import React from "react";

// export const KpiCard = ({ icon, label, value, sub, color = '#3b82f6' }) => (
//   <div className="bg-white border border-gray-200 shadow rounded-lg p-4 relative overflow-hidden">
//   {/* <div className="bg-[#131929] border border-[#1f2e47] rounded-xl p-5 relative overflow-hidden"> */}
//     <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />
//     {icon && <div className="absolute top-4 right-4 text-2xl opacity-30">{icon}</div>}
//     <div className="text-[#64748b] text-[11px] font-semibold uppercase tracking-wider">{label}</div>
//     {/* <div className="text-[28px] font-bold text-[#e2e8f0] mt-2 leading-none">{value}</div> */}
//     <div className="text-[30px] font-bold text-[#0d0d0d] mt-2 leading-none">{value}</div>
//     <div className="text-[#64748b] text-[11px] mt-1">{sub}</div>
//   </div>
// );

// export const KpiCard = ({ icon, label, value, sub, type }) => {
//   const borderColors = {
//     1: "border-t-[#3b82f6]",
//     2: "border-t-[#f97316]",
//     3: "border-t-[#ef4444]",
//     4: "border-t-[#91008D]",
//     5: "border-t-[#215E61]",
//     6: "border-t-[#CB2957]",
//   };

//   return (
//     <div className={`bg-white rounded-lg p-5 border border-slate-200 shadow-xl border-t-2 ${borderColors[type]} transition relative`}>
//       {icon && (
//         <span className="absolute top-4 right-5 text-xl opacity-30">
//           {icon}
//         </span>
//       )}
//       <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
//         {label}
//       </div>
//       <div className="font-mono text-3xl font-bold text-slate-800 mt-1.5 leading-tight">
//         {value || 0}
//       </div>
//       <div className="text-sm text-slate-700">{sub}</div>
//     </div>
//   );
// };

export const KpiCard = ({ icon, label, value, sub, type }) => {
  const colors = {
    1: "bg-blue-500",
    2: "bg-orange-500",
    3: "bg-red-500",
    4: "bg-violet-500",
    5: "bg-emerald-500",
    6: "bg-pink-500",
  };

  return (
    <div className="group rounded-lg border border-slate-200 bg-gradient-to-br from-blue-100/70 to-white px-4 py-3 transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between">

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-sm ${
                colors[type] || "bg-blue-500"
              }`}
            />
            <span className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </span>
          </div>

          <div className="mt-2 flex items-end gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-700">
              {value || 0}
            </h2>
          </div>

          {sub && (
            <p className="mt-1 truncate text-xs text-slate-500">
              {sub}
            </p>
          )}

        </div>

        {/* {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            {icon}
          </div>
        )} */}
      </div>
    </div>
  );
};

// export const InsightCard = ({ title, body, type = "info" }) => {
//   const borderColors = {
//     info: "border-t-[#3b82f6]",
//     warn: "border-t-[#f97316]",
//     danger: "border-t-[#ef4444]",
//     success: "border-t-[#06d6a0]",
//   };
//   return (
//     <div
//       className={`bg-white border border-gray-300 border-t-2 shadow-xl rounded-lg py-5 px-3.5 ${borderColors[type]}`}
//     >
//       {/* <div className={`bg-[#1a2236] border border-[#1f2e47] border-l-4 rounded-lg p-3.5 ${borderColors[type]}`}> */}
//       <div className="font-semibold text-[15px] text-gray-900 mb-1">
//         {title}
//       </div>
//       <div className="text-black text-md leading-relaxed" dangerouslySetInnerHTML={{ __html: body }}></div>
//     </div>
//   );
// };

export const InsightCard = ({ title, body, type = "info" }) => {
  const styles = {
    info: "border-blue-400 text-blue-600 bg-blue-50",
    warn: "border-amber-400 text-amber-600 bg-amber-50",
    danger: "border-red-400 text-red-600 bg-red-50",
    success: "border-emerald-400 text-emerald-600 bg-emerald-50",
  };

  return (
    <div className={`border-l-[3px] ${styles[type]} rounded-r-sm px-3 py-2`}>
      <div className="flex items-baseline gap-1.5">
        <span className="opacity-30">|</span>
        <span className="text-md font-medium text-gray-800">{title}</span>
      </div>
      <div 
        className="text-[14px] text-gray-600 mt-1 leading-tight" 
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
};

export const Pill = ({ children, color = "blue" }) => {
  const colors = {
    green: "bg-[rgba(6,214,160,0.1)] text-[#06d6a0]",
    red: "bg-[rgba(239,68,68,0.1)] text-[#ef4444]",
    yellow: "bg-[rgba(245,158,11,0.1)] text-[#f59e0b]",
    purple: "bg-[rgba(139,92,246,0.1)] text-[#8b5cf6]",
    blue: "bg-[rgba(59,130,246,0.1)] text-[#3b82f6]",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
};

export const ProgressBar = ({ value, color = "#06d6a0" }) => (
  <div className="h-1.5 bg-[#dcdcdc] rounded overflow-hidden mt-1">
    {/* <div className="h-full rounded" style={{ width: `${Math.min(value * 3, 100)}%`, background: color }} /> */}
    <div
      className="h-full rounded"
      style={{ width: `${Math.min(value, 100)}%`, background: color }}
    />
  </div>
);

export function formatNumber(num) {
  const sign = num < 0 ? "-" : "";
  const absNum = Math.abs(num) || 0;

  if (absNum >= 10000000) {
    return sign + (absNum / 10000000).toFixed(2) + "CR";
  } else if (absNum >= 100000) {
    return sign + (absNum / 100000).toFixed(2) + "L";
  } else if (absNum >= 1000) {
    return sign + (absNum / 1000).toFixed(2) + "K";
  } else {
    return sign + absNum.toString();
  }
}

// 1f2e47
