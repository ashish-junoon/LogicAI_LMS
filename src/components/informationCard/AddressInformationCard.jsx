import {
  RiEditLine,
  RiMapPinLine,
} from "react-icons/ri";

import Button from "../utils/Button";
import { useLoanDetails } from "../../provider/loanContext";

const AddressInformationCard = ({ permission, onEdit }) => {
  const { loanDetails } = useLoanDetails();

  const Field = ({ label, value }) => (
    <div>
      <p className="mb-1 text-[11px] font-medium text-slate-500">
        {label}
      </p>

      <p className="text-sm font-medium text-slate-800">
        {value || "N/A"}
      </p>
    </div>
  );

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
      {/* Header */}
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
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-primary/10
              text-primary
            "
          >
            <RiMapPinLine size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Address Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Customer residential address
            </p>
          </div>
        </div>

        {permission && (
          <Button
            type="button"
            onClick={onEdit}
            btnName={
              <span className="flex items-center gap-1.5">
                <RiEditLine size={14} />
                Edit Address
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

      {/* Address Details */}
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
          {/* Address */}
          <div className="col-span-2 max-xl:col-span-2 max-sm:col-span-1">
            <Field
              label="Address"
              value={loanDetails?.full_address}
            />
          </div>

          {/* State */}
          <Field
            label="State"
            value={loanDetails?.state}
          />

          {/* City */}
          <Field
            label="City"
            value={loanDetails?.city}
          />

          {/* ZIP */}
          <Field
            label="ZIP / Pincode"
            value={loanDetails?.zip}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInformationCard;
