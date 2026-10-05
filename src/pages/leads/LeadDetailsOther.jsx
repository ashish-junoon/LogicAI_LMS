import { useEffect, useState } from "react";
import OtherLeadsWrapper from "../../components/lead/OtherLeadsWrapper";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import { GetLoanById } from "../../api/loan";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoanDetails } from "../../provider/loanContext";
import LoanHeader from "../../components/utils/LoanHeader";
import Loader from "../../components/utils/Loader";

const LeadDetailsOther = () => {
  const { state } = useLocation();
  const [leadDetails, setLeadDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const {setLoanDetails, setsingleLoanDetails} = useLoanDetails();
  
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
        const transformedData = res?.data?.find(data=> data?.loan_id == state?.loan_id)
        setsingleLoanDetails(transformedData)
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
    <>
    {loading && <Loader />}
    <div>
      {/* <InfoCard /> */}
      <Breadcrumbs
        items={[
          { label: "All Leads", path: "/all-leads" },
          { label: state?.loan_id },
        ]}
      />
      <LoanHeader lead={{
        ...leadDetails,
        ...state
      }} />
      {/* // {...lead, stage: "closed", status: "Closed"} */}
      <OtherLeadsWrapper loanData={{
        ...leadDetails,
        ...state
      }} />
    </div>
    </>
  );
};

export default LeadDetailsOther;
