import React from "react";
import CreditWrapper from "../../components/lead/CreditWrapper";
import InfoCard from "../../components/common/InfoCard";
import UserHeader from "../../components/utils/UserHeader";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import { lead } from "../../content/data";

const CreditDetails = () => {
  return (
    <div>
        {/* <InfoCard /> */}
        <Breadcrumbs items={[{ label: "Credit Analysis", path: "/leads-assesment" }, { label: "LD-0001" }]} />
        <UserHeader permisssion lead={{...lead,   stage: "credit-analysis", status: "Credit Analysis",}} />
        <CreditWrapper />
    </div>
  );
};

export default CreditDetails;
