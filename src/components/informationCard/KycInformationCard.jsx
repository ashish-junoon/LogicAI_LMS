import {
  RiCheckboxCircleFill,
  RiEditLine,
  RiShieldUserLine,
} from "react-icons/ri";

import Button from "../utils/Button";
import DownloadDoc from "../fields/DownloadDoc";
import { useLoanDetails } from "../../provider/loanContext";
import { mask } from "../utils/common";

const KycInformationCard = ({ permission, onEdit }) => {
  const { loanDetails } = useLoanDetails();

  const details = [
    {
      label: "Aadhaar Number",
      value: loanDetails?.aadhaar_number,
    },
    {
      label: "PAN Number",
      value: loanDetails?.pan_card_number,
    },
  ];

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-slate-200
          bg-gradient-to-r
          from-primary/10
          via-white
          to-white
          px-4
          py-3
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-primary/10
              bg-primary/10
            "
          >
            <RiShieldUserLine className="text-xl text-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              KYC Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Identity verification documents
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          KYC INFORMATION
      ====================================================== */}
      <div className="p-4">
        <div
          className="
            grid
            grid-cols-3
            gap-x-4
            gap-y-4
            max-lg:grid-cols-2
            max-sm:grid-cols-1
          "
        >
          {/* Aadhaar Number */}
          {loanDetails?.aadhaar_number && (
            <div>
              <p className="mb-1 text-[11px] font-medium text-slate-500">
                Aadhaar Number
              </p>

              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {mask(loanDetails?.aadhaar_number)}
                </p>

                <span
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-md
                    bg-green-50
                    px-2
                    py-1
                    text-[11px]
                    font-medium
                    text-green-700
                  "
                >
                  <RiCheckboxCircleFill size={14} />
                  Verified
                </span>
              </div>
            </div>
          )}

          {/* PAN Number */}
          {loanDetails?.pan_card_number && (
            <div>
              <p className="mb-1 text-[11px] font-medium text-slate-500">
                PAN Number
              </p>

              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {mask(loanDetails?.pan_card_number)}
                </p>

                <span
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-md
                    bg-green-50
                    px-2
                    py-1
                    text-[11px]
                    font-medium
                    text-green-700
                  "
                >
                  <RiCheckboxCircleFill size={14} />
                  Verified
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycInformationCard;
