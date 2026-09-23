import InfoCard from "../../components/common/InfoCard";
import OtherLeadsWrapper from "../../components/lead/OtherLeadsWrapper";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import LeadStatus from "../../components/utils/LeadStatus";
import UserHeader from "../../components/utils/UserHeader";
import { lead } from "../../content/data";

const LeadDetailsOther = () => {
  return (
    <div>
      {/* <LeadStatus currentStep={3} /> */}
      {/* <InfoCard /> */}
      <Breadcrumbs
        items={[
          { label: "All Leads", path: "/all-leads" },
          { label: "LD-0001" },
        ]}
      />
      <UserHeader lead={{...lead, stage: "closed", status: "Closed"}} />
      <OtherLeadsWrapper />
    </div>
  );
};

export default LeadDetailsOther;
