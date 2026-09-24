import { useEffect, useState } from "react";
import InfoCard from "../../components/common/InfoCard";
import OtherLeadsWrapper from "../../components/lead/OtherLeadsWrapper";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import LeadStatus from "../../components/utils/LeadStatus";
import UserHeader from "../../components/utils/UserHeader";
import { lead } from "../../content/data";
import { GetLoanById } from "../../api/loan";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoanDetails } from "../../provider/loanContext";

const LeadDetailsOther = () => {
  const { state } = useLocation();
  const [leadDetails, setLeadDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const {setLoanDetails} = useLoanDetails();
  // console.log("state", state)

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await GetLoanById({
        loan_id: state?.loan_id,
        product_code: state?.product_code,
      })
      if (res?.status) {
        setLeadDetails(res?.data)
        setLoanDetails(res?.data)
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLoans();
  }, [])


  return (
    <div>
      {/* <LeadStatus currentStep={3} /> */}
      {/* <InfoCard /> */}
      <Breadcrumbs
        items={[
          { label: "All Leads", path: "/all-leads" },
          { label: state?.loan_id },
        ]}
      />
      <UserHeader lead={{
        ...leadDetails,
        ...state
      }} />
      {/* // {...lead, stage: "closed", status: "Closed"} */}
      <OtherLeadsWrapper loanData={{
        ...leadDetails,
        ...state
      }} />
    </div>
  );
};

export default LeadDetailsOther;
