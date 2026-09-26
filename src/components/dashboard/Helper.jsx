import React from "react";

// =============================================================
// KpiCard — self-contained ledger stat cell (own border on all
// sides, so it holds its shape in any grid/flex context).
// =============================================================
export const KpiCard = ({
  icon,
  label,
  value,
  sub,
  color = "#2F6FA6",
  type,
}) => {
  const ruleColors = {
    1: "#2F6FA6",
    2: "#B9800F",
    3: "#C1443C",
    4: "#6B54C7",
    5: "#1F8F68",
    6: "#96690F",
  };
  const rule = ruleColors[type] || color;

  return (
    <div
      className="bg-white border border-[#DCE1E6] pl-3.5 pr-3 py-3 min-w-0"
      style={{ borderLeft: `3px solid ${rule}` }}
    >
      <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#8B98A6] truncate">
        {label}
      </div>
      <div
        className="mt-1.5 text-[21px] font-semibold text-[#16202B] leading-none tabular-nums truncate"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {value || 0}
      </div>
      {sub && (
        <div className="mt-1.5 text-[11px] text-[#8B98A6] truncate">{sub}</div>
      )}
    </div>
  );
};

// =============================================================
// InsightCard — panel with colored top hairline + label tag
// =============================================================
export const InsightCard = ({ title, body, type = "info", hidetype }) => {
  const styles = {
    info: { rule: "#2F6FA6", tag: "Note" },
    warn: { rule: "#B9800F", tag: "Watch" },
    danger: { rule: "#C1443C", tag: "Risk" },
    success: { rule: "#1F8F68", tag: "Strong" },
  };
  const s = styles[type] || styles.info;

  return (
    <div
      className="bg-white border border-[#DCE1E6] px-3.5 py-3"
      style={{ borderTop: `2px solid ${s.rule}` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {hidetype ? (
          <span
            className={`w-2 h-2 animate-pulse`}
            style={{ backgroundColor: s.rule }}
          ></span>
        ) : (
          <span
            className="text-[7px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5"
            style={{ color: s.rule, border: `1px solid ${s.rule}55` }}
          >
            {s.tag}
          </span>
        )}
        <span className="text-[13px] font-medium text-[#16202B] truncate">
          {title}
        </span>
      </div>
      <div
        className="text-[12.5px] text-[#5B6B7A] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
};

// =============================================================
// Pill — bordered chip (outline, not filled) for table risk tags
// =============================================================
export const Pill = ({ children, color = "#96690F" }) => {
  const colors = {
    green: "#1F8F68",
    red: "#C1443C",
    yellow: "#B9800F",
    purple: "#6B54C7",
    blue: "#2F6FA6",
    "#5050b8": "#2F6FA6",
  };
  const c = colors[color] || color;
  return (
    <span
      className="inline-block px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
      style={{ color: c, border: `1px solid ${c}55`, background: `${c}0F` }}
    >
      {children}
    </span>
  );
};

// =============================================================
// ProgressBar — thin 1px ledger tick, no rounding
// =============================================================
export const ProgressBar = ({ value, color = "#1F8F68" }) => (
  <div className="h-[3px] bg-[#E8EBEE] mt-1.5 overflow-hidden">
    <div
      className="h-full"
      style={{ width: `${Math.min(value, 100)}%`, background: color }}
    />
  </div>
);

// =============================================================
// Panel — the base ledger surface used for every chart/table block
// =============================================================
export const Panel = ({ title, sub, right, children, className = "" }) => (
  <div className={`bg-white border border-[#DCE1E6] ${className}`}>
    {(title || right) && (
      <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-3 border-b border-[#E8EBEE]">
        <div className="min-w-0">
          {title && (
            <div className="text-[12.5px] font-medium text-[#16202B] truncate">
              {title}
            </div>
          )}
          {sub && (
            <div className="text-[10.5px] text-[#8B98A6] mt-0.5 truncate">
              {sub}
            </div>
          )}
        </div>
        {right}
      </div>
    )}
    <div className="p-4">{children}</div>
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
