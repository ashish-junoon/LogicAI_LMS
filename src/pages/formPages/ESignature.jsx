import KycWrapper from "../../components/lead/KycWrapper";
import InfoCard from "../../components/common/InfoCard";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import UserHeader from "../../components/utils/UserHeader";
import { lead } from "../../content/data";
import SignatureWrapper from "../../components/lead/SignatureWrapper";

const ESignature = () => {
  return (
    <div>
      {/* <InfoCard /> */}
      <Breadcrumbs
        items={[
          { label: "E Signature", path: "/leads-signature" },
          { label: "LD-0001" },
        ]}
      />
      <UserHeader
      permisssion
        lead={{ ...lead, stage: "esign", status: "E Signature" }}
      />
      <SignatureWrapper />
    </div>
  );
};

export default ESignature;
