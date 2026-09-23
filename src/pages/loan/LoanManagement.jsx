import React from "react";
import LoanWrapper from "../../components/lead/LoanWrapper";
import InfoCard from "../../components/common/InfoCard";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import { lead } from "../../content/data";
import UserHeader from "../../components/utils/UserHeader";

const LoanManagement = () => {
  return (
    <div>
      {/* <InfoCard /> */}
      <Breadcrumbs
        items={[
          { label: "All Loans", path: "/leads-assesment" },
          { label: "LD-0001" },
        ]}
      />
      <UserHeader lead={{...lead, stage: "closed", status: "Closed"}} />
      <LoanWrapper />
    </div>
  );
};

export default LoanManagement;
