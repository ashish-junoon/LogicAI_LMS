import React from "react";

// =============================================================
// SectionCard — shared modern container used by every chart /
// table block across the dashboard. Keeps layout identical to
// the previous "bg-gray-50/50 border rounded-xl p-5" wrapper,
// just with a refreshed visual language.
// =============================================================
export const SectionCard = ({
  title,
  subtitle,
  accent = "bg-primary",
  action,
  className = "",
  bodyClassName = "",
  children,
}) => (
  <div
    className={`group relative rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-slate-300/80 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.16)] ${className}`}
  >
    {(title || subtitle || action) && (
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent}`} />
            {title && (
              <div className="truncate text-[13px] font-semibold tracking-tight text-slate-800">
                {title}
              </div>
            )}
          </div>
          {subtitle && (
            <div className="mt-1 truncate pl-3.5 text-[11px] font-medium text-slate-400">
              {subtitle}
            </div>
          )}
        </div>
        {action}
      </div>
    )}
    <div className={bodyClassName}>{children}</div>
  </div>
);

// =============================================================
// KpiCard
// =============================================================
export const KpiCard = ({ icon, label, value, sub, type = 1 }) => {
  const palette = {
    1: "bg-blue-500",
    2: "bg-orange-500",
    3: "bg-red-500",
    4: "bg-violet-500",
    5: "bg-emerald-500",
    6: "bg-pink-500",
  };
  const dot = palette[type] || palette[1];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-[0_18px_36px_-16px_rgba(15,23,42,0.18)]">
      <span
        className={`absolute inset-x-0 top-0 h-[3px] rounded-t-2xl ${dot} opacity-90`}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
            <span className="truncate text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              {label}
            </span>
          </div>

          <div className="mt-2 flex items-end gap-1.5">
            <h2 className="text-[26px] font-bold leading-none tracking-tight text-slate-800">
              {value || 0}
            </h2>
          </div>

          {sub && (
            <p className="mt-1.5 truncate text-[11px] font-medium text-slate-400">
              {sub}
            </p>
          )}
        </div>

        {icon && (
          <span className="shrink-0 text-base opacity-40 transition-opacity duration-300 group-hover:opacity-70">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

// =============================================================
// InsightCard
// =============================================================
export const InsightCard = ({ title, body, type = "info" }) => {
  const styles = {
    info: { ring: "ring-blue-100/80", text: "text-blue-600", dot: "bg-blue-500" },
    warn: { ring: "ring-amber-100/80", text: "text-amber-600", dot: "bg-amber-500" },
    danger: { ring: "ring-red-100/80", text: "text-red-600", dot: "bg-red-500" },
    success: { ring: "ring-emerald-100/80", text: "text-emerald-600", dot: "bg-emerald-500" },
  };
  const s = styles[type] || styles.info;

  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white p-4 ring-1 ${s.ring} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-16px_rgba(15,23,42,0.18)]`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
        <span className={`text-[11px] font-bold uppercase tracking-wide ${s.text}`}>
          {title}
        </span>
      </div>
      <div
        className="mt-2 text-[13px] leading-relaxed text-slate-600"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
};

// =============================================================
// Pill
// =============================================================
export const Pill = ({ children, color = "blue" }) => {
  const map = {
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-amber-50 text-amber-600",
    purple: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
  };
  const dotMap = {
    green: "bg-emerald-500",
    red: "bg-red-500",
    yellow: "bg-amber-500",
    purple: "bg-violet-500",
    blue: "bg-blue-500",
  };
  const cls = map[color] || "bg-slate-100 text-slate-600";
  const dot = dotMap[color] || "bg-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
};

// =============================================================
// ProgressBar
// =============================================================
export const ProgressBar = ({ value, color = "#06d6a0" }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
    <div
      className="h-full rounded-full transition-all duration-500 ease-out"
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
