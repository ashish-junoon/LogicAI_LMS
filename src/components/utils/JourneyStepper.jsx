import { FiCheck } from "react-icons/fi";

/**
 * steps: [{ key, label }]
 * currentKey: the key of the step currently active/reached
 * doneKeys?: array of keys explicitly marked complete (defaults to every
 *            step before currentKey)
 */

const JOURNEY_STEPS = [
  { key: "draft", label: "Draft" },
  { key: "new", label: "New" },
  { key: "credit-analysis", label: "Credit Analysis" },
  { key: "kyc", label: "KYC" },
  { key: "disbursement", label: "Disbursement" },
];

export default function JourneyStepper({ steps = JOURNEY_STEPS, currentKey, rejectedAt }) {
  const currentIndex = steps.findIndex((s) => s.key === currentKey);

  return (
    <div className="flex w-full items-center overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const isRejected = rejectedAt === step.key;
        const isDone = !isRejected && i < currentIndex;
        const isCurrent = !isRejected && i === currentIndex;

        return (
          <div key={step.key} className="flex min-w-[92px] flex-1 items-center last:min-w-0 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  isRejected
                    ? "border-red-600 bg-red-50 text-red-600"
                    : isDone
                    ? "border-primary bg-primary text-white"
                    : isCurrent
                    ? "border-primary bg-white text-primary"
                    : "border-surface-border bg-white text-gray-400",
                ].join(" ")}
              >
                {isRejected ? "!" : isDone ? <FiCheck size={14} /> : i + 1}
              </div>
              <span
                className={[
                  "whitespace-nowrap text-center text-[11px] font-medium",
                  isRejected ? "text-red-600" : isCurrent ? "text-primary" : isDone ? "text-gray-700" : "text-gray-400",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 rounded ${
                  i < currentIndex && !isRejected ? "bg-primary" : "bg-surface-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
