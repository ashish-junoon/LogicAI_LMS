import React from "react";
import {
  FiUserPlus,
  FiSearch,
  FiShield,
  FiCreditCard,
  FiCheck,
} from "react-icons/fi";

const LeadStatus = ({ currentStep = 1 }) => {
  const steps = [
    {
      id: 1,
      title: "New Lead",
      icon: FiUserPlus,
    },
    {
      id: 2,
      title: "Credit Analysis",
      icon: FiSearch,
    },
    {
      id: 3,
      title: "KYC",
      icon: FiShield,
    },
    {
      id: 4,
      title: "Disbursement",
      icon: FiCreditCard,
    },
    {
      id: 5,
      title: "Active Loan",
      icon: FiCheck,
    },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 mb-2">
      <div className="flex items-center w-full overflow-x-auto">

        {steps.map((step, index) => {
          const Icon = step.icon;

          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <React.Fragment key={step.id}>

              {/* Step */}
              <div className="flex flex-col items-center min-w-[100px]">

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                    isCompleted
                      ? "bg-primary border-primary text-white"
                      : isCurrent
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <FiCheck size={15} />
                  ) : (
                    <Icon size={13} />
                  )}
                </div>

                <span
                  className={`mt-1.5 text-[9px] font-medium whitespace-nowrap ${
                    isCurrent
                      ? "text-primary font-semibold"
                      : isCompleted
                      ? "text-gray-400 font-semibold"
                      : "text-gray-400 font-semibold"
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={`h-[1px] flex-1 min-w-[30px] ${
                    step.id < currentStep
                      ? "bg-primary"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LeadStatus;