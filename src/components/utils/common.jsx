function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name?.length; i++) hash = name?.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

const PALETTE = [
  "bg-primary",
  "bg-[#0E7C7B]",
  "bg-[#7C5CBF]",
  "bg-[#B4691E]",
  "bg-[#3B7A57]",
  "bg-[#B4467A]",
];

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export default function Avatar({ name, size = "md", ring = false }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        colorFor(name),
        SIZES[size],
        ring ? "ring-2 ring-white/80" : "",
      ].join(" ")}
    >
      {initials}
    </div>
  );
}


const STYLES = {
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  neutral: "bg-blue-50 text-blue-500",
  primary: "bg-white text-primary",
};

const DOT_STYLES = {
  success: "bg-green-600",
  warning: "bg-amber-600",
  danger: "bg-red-600",
  neutral: "bg-blue-400",
  primary: "bg-primary",
};

export function StatusBadge({ label, variant = "neutral", dot = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[variant] || STYLES.neutral}`}
    >
      {dot && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_STYLES[variant] || DOT_STYLES.neutral}`} />}
      {label}
    </span>
  );
}
