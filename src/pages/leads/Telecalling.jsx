import Breadcrumbs from "../../components/utils/Breadcrumbs";
import UserHeader from "../../components/utils/UserHeader";
import { lead } from "../../content/data";
import TelecallinWrapper from "../../components/lead/TelecallingWrapper";

const Telecalling = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Telecalling", path: "/leads-telecalling" },
          { label: "LD-0001" },
        ]}
      />
      <UserHeader
        permisssion
        lead={{ ...lead, stage: "tele", status: "Telecalling" }}
      />
      <TelecallinWrapper />
    </div>
  );
};

export default Telecalling;
