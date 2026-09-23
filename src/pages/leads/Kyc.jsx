import KycWrapper from "../../components/lead/KycWrapper";
import InfoCard from "../../components/common/InfoCard";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import UserHeader from "../../components/utils/UserHeader";
import { lead } from "../../content/data";

const Kyc = () => {
  return (
    <div>
      {/* <InfoCard /> */}
      <Breadcrumbs
        items={[
          { label: "Kyc Leads", path: "/leads-kyc" },
          { label: "LD-0001" },
        ]}
      />
      <UserHeader
      permisssion
        lead={{ ...lead, stage: "kyc", status: "KYC Verification" }}
      />
      <KycWrapper />
    </div>
  );
};

export default Kyc;
