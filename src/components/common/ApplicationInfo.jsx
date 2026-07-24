import React from "react";
import Icon from "../../components/utils/Icon";
import InfoCard from "./InfoCard";

const ApplicationInfo = ({children}) => {
  return (
    <div>
      <div>
        <InfoCard />
      </div>

      <div>
        {children}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-3">
          <button className="px-6 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
            Reject Application
          </button>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Edit Info
          </button>
          <button
            // onClick={() => onAction?.("approve")}
            className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Icon name={"RiCalendarLine"} color="white" size={18} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationInfo;