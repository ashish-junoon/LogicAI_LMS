// =============================================================
// DESIGN TOKENS — "Ledger" theme (light)
// Paper-white ledger surface, ink-navy text, restrained bronze
// accent for money figures. Structure kept simple and standard
// (plain bordered boxes, no zero-gap grid tricks) so it holds up
// inside any existing page shell.
// =============================================================

export const THEME = {
  bg: "#EEF1F3",
  panel: "#FFFFFF",
  panelSoft: "#F7F8F9",
  line: "#DCE1E6",
  lineSoft: "#E8EBEE",
  ink: "#16202B",
  inkDim: "#5B6B7A",
  inkFaint: "#8B98A6",
  gold: "#96690F",
  goldSoft: "rgba(150,105,15,0.10)",
};

// Status palette — used consistently across charts, pills, rules
export const COLORS = {
  paid: "#66BB6A",
  Paid: "#66BB6A",
  npa: "red",
  NPA: "red",
  pending: "#C1443C",
  Pending: "#C1443C",
  foreclosure: "#6B54C7",
  Foreclosure: "#6B54C7",
  settled: "#2F6FA6",
  Settled: "#2F6FA6",
  partial: "#6B7280",
  Partially: "#6B7280",
  "Waive Off": "#6B7280",
  accent: "#2F6FA6",
  accent2: "#66BB6A",
  gold: "#96690F",
};

// Ordered status color ramp for multi-series charts (doughnuts etc.)
export const STATUS_RAMP = [
  COLORS.paid,
  COLORS.Paid,
  COLORS.npa,
  COLORS.NPA,
  COLORS.pending,
  COLORS.Pending,
  COLORS.foreclosure,
  COLORS.Foreclosure,
  COLORS.settled,
  COLORS.Settled,
  COLORS.partial,
  COLORS.Partially,
  "#9CA6AF",
];

// Sequential ramp for distributions (credit score bands, loan size, tenure)
export const SEQUENTIAL_RAMP = [
  "#C1443C",
  "#B9800F",
  "#96690F",
  "#2F6FA6",
  "#1F8F68",
  "#1B7A59",
];

export function fmtCr(n) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(1) + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(1) + " L";
  return "₹" + (n || 0).toLocaleString();
}
