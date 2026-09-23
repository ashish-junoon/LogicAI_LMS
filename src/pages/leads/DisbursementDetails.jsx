import DisbursementWrapper from "../../components/lead/DisbursementWrapper";
import InfoCard from "../../components/common/InfoCard";
import { lead } from "../../content/data";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import UserHeader from "../../components/utils/UserHeader";

const DisbursementDetails = () => {
  return (
    <div>
      {/* <InfoCard /> */}
      <Breadcrumbs
        items={[
          { label: "Disbursement Leads", path: "/leads-disbursement" },
          { label: "LD-0001" },
        ]}
      />
      <UserHeader permisssion lead={{...lead, stage: "disbursement", status: "Disbursement"}} />
      <DisbursementWrapper />
    </div>
  );
};

export default DisbursementDetails;
