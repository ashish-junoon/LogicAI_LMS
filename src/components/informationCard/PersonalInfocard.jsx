import {
  RiUser3Line,
  RiEditLine,
} from "react-icons/ri";

import Button from "../utils/Button";
import { useLoanDetails } from "../../provider/loanContext";
import { formatDate, mask } from "../utils/common";

const PersonalInfocard = ({ permission, onEdit }) => {
  const { loanDetails } = useLoanDetails();

  const details = [
    {
      label: "Customer Name",
      value: loanDetails?.customer_name,
    },
    {
      label: "Father Name",
      value: loanDetails?.father_name,
    },
    {
      label: "Date of Birth",
      value: mask(formatDate(loanDetails?.dob)),
    },
    {
      label: "Mobile Number",
      value: mask(loanDetails?.mobile_number),
    },
    {
      label: "Email Address",
      value: loanDetails?.email,
    },
    {
      label: "Religion",
      value: loanDetails?.religion,
    },
    {
      label: "Marital Status",
      value: loanDetails?.marital_status,
    },
    {
      label: "Gender",
      value: loanDetails?.gender,
    },
  ];

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between
          border-b border-slate-200
          bg-gradient-to-r from-primary/10 via-white to-white
          px-4 py-3
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-lg
              border border-primary/10
              bg-primary/10
            "
          >
            <RiUser3Line className="text-xl text-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Customer Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Basic customer details
            </p>
          </div>
        </div>

        {permission && (
          <Button
            type="button"
            onClick={onEdit}
            btnName={
              <span className="flex items-center gap-1.5">
                <RiEditLine size={15} />
                Edit
              </span>
            }
            style="
              !w-auto
              px-3
              py-1.5
              bg-white
              border
              border-primary
              text-primary
              hover:bg-primary
              hover:text-white
              text-xs
              font-medium
              rounded-lg
            "
          />
        )}
      </div>

      {/* Information */}
      <div className="p-4">
        <div
          className="
            grid
            grid-cols-4
            gap-x-4
            gap-y-4
            max-xl:grid-cols-2
            max-sm:grid-cols-1
          "
        >
          {details.map(
            (item) =>
              item.value && (
                <div key={item.label}>
                  <p className="mb-1 text-[11px] font-medium text-slate-500">
                    {item.label}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {item.value}
                  </p>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfocard;