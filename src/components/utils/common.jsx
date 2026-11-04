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

const BADGE_STATUS = {
  4: "New Leads",
  5: "Credit Analysis",
  6: "Telecalling / Bookings",
  7: "Disbursement",
}

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const downloadBase64File = (
  base64,
  fileName = "download.zip",
  mimeType = "application/zip"
) => {
  try {
    if (!base64) {
      throw new Error("Base64 data is empty");
    }

    const cleanBase64 = base64.replace(
      /^data:[^;]+;base64,/,
      ""
    );

    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("File download failed:", error);
  }
};

export const showValidationError = (error, formik = null, field = null) => {
  const errors = error.response?.data?.errors;
  if (errors) {
    Object.values(errors).flat().forEach((message) => {
      formik ? formik.setFieldError(field, message) : toast.error(message);
    });
  } else {
    const err = error.message || "Something went wrong while verifying account number";
    formik ? formik.setFieldError(field, err) : toast.error(err);
  }
}

export function StatusBadge({ label, variant = "neutral", dot = true, app_status=0 }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-white text-blue-700 || STYLES.neutral}`}
    >
      {dot && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_STYLES[variant] || DOT_STYLES.neutral}`} />}
      {BADGE_STATUS?.[app_status]}
    </span>
  );
}


export const mask = (value) => {
  if(!value) return "";
  return "X".repeat(value?.length - 4) + value?.slice(-4)
}

export const formatDate = (date) => {
  if (!date) return "";

  // Already DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }

  // YYYYMMDD
  if (/^\d{8}$/.test(date)) {
    return `${date.slice(6, 8)}/${date.slice(4, 6)}/${date.slice(0, 4)}`;
  }

  // Valid date string
  const parsedDate = new Date(date);
  if (!Number.isNaN(parsedDate.getTime())) {
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return date;
};
