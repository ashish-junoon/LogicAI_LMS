import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import UserHeader from "../../components/utils/UserHeader";
import TelecallinWrapper from "../../components/lead/TelecallingWrapper";
import Loader from "../../components/utils/Loader";
import { CustomerDetails, SettingApplicationStep } from "../../api/application";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthData } from "../../context/authContext";
import Button from "../../components/utils/Button";
import { SettingStatus } from "../../api/userApi";
import { toast } from "react-toastify";
import Modal from "../../components/utils/Modal";
import { showValidationError } from "../../components/utils/common";

const Telecalling = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeLead = location.state?.lead;
  const customerId = searchParams.get("customer_id") || routeLead?.customer_id;
  const applicationId =
    searchParams.get("application_id") || routeLead?.application_id;
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [remark, setRemark] = useState("");

  const { authData } = useAuthData();
  const navigate = useNavigate()
  const refreshCustomerDetails = async () => {
    try {
      const response = await CustomerDetails({
        customer_id: customerId,
        application_id: applicationId,
        role: authData?.role,
        created_by: authData?.user_id,
      });
      if (!response?.status || !response?.data) {
        throw new Error(
          response?.message || "Failed to refresh customer details.",
        );
      }
      setCustomerDetails(response.data);
      return true;
    } catch (refreshError) {
      console.error("Error refreshing telecalling details:", refreshError);
      return false;
    }
  };

  
    const confirmSubmit = async () => {
      try {
        const payload = {
          customer_id: customerId,
          application_id: applicationId,
          from_step: 6,
          to_step: 7,
          role: authData?.role,
          reason: "Booking & Telecalling Verified",
          remark: "Booking & Telecalling Verified",
          created_by: authData?.user_id,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
        };
  
        const response = await SettingApplicationStep(payload);
  
        if (!response?.status) {
          toast.info(response.message || "Error in submitting form!");
        }
      } catch (error) {
        console.error("Failed to submit application:", error);
        showValidationError(error);
      }
    };


  const handleTelecallingVerified = async () => {
    try {
      setLoading(true);
      const req = {
        customer_id: customerId,
        application_id: applicationId,
        type: "TELECALLING",
        status: true,
        created_by: authData?.user_id,
        company_id: import.meta.VITE_COMPANY_ID,
        product_name: import.meta.VITE_PRODUCT_NAME,
      };

      const response = await SettingStatus(req);
      if (response.status) {
        await confirmSubmit()
        toast.success(response.message || "Application Procceds.");
        // fetchData?.();
        navigate(-1)
      } else {
        toast.info(response.message || "Unable to Proceed!");
      }
    } catch (error) {
      showValidationError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;

    const fetchCustomerDetails = async () => {
      if (!customerId || !applicationId) {
        setError(
          "Customer ID and application ID are required to load this lead.",
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await CustomerDetails({
          customer_id: customerId,
          application_id: applicationId,
          role: "admin",
          created_by: "admin",
        });

        if (!response?.status || !response?.data) {
          throw new Error(
            response?.message || "Failed to load customer details.",
          );
        }

        if (isCurrent) setCustomerDetails(response.data);
      } catch (fetchError) {
        console.error("Error fetching telecalling lead details:", fetchError);
        if (isCurrent) {
          setError(
            fetchError?.response?.data?.message ||
              fetchError?.message ||
              "Something went wrong while loading customer details.",
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    fetchCustomerDetails();

    return () => {
      isCurrent = false;
    };
  }, [customerId, applicationId]);

  const matchesLead = (record) => {
    const recordCustomerId = record?.customer_id;
    const recordApplicationId =
      record?.application_id || record?.applicantion_id;

    return (
      (!recordCustomerId || recordCustomerId === customerId) &&
      (!recordApplicationId || recordApplicationId === applicationId)
    );
  };
  const scopedDetails = customerDetails
    ? Object.fromEntries(
        Object.entries(customerDetails).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.filter(matchesLead) : value,
        ]),
      )
    : null;
  const marketSurvey = scopedDetails?.marketSurvey?.[0];
  const personalKyc = scopedDetails?.personalKyc?.[0];
  const loanDetails = scopedDetails?.loanDetails?.[0];
  const lead = {
    ...routeLead,
    customer_name:
      personalKyc?.full_name ||
      marketSurvey?.business_owner_name ||
      routeLead?.business_owner_name,
    loan_id: applicationId,
    product_code: loanDetails?.product_code || loanDetails?.loan_type,
    loan_amount: loanDetails?.loan_amount,
    loan_status: routeLead?.status || "Telecalling",
    stage: "tele",
    app_form_status: scopedDetails?.workflowNodes?.[0]?.app_form_status,
  };

  const handleOpenConfirmModal = () => {
    setRemark("");
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    if (loading) return;

    setShowConfirmModal(false);
    setRemark("");
  };

  const handleTelecalling = () => {
    return (
      <>
        <div>
          <Button
            variant="secondary"
            style="!border-white/0 !bg-white !text-primary hover:!bg-white/90 rounded-md text-sm font-medium"
            onClick={handleOpenConfirmModal}
          >
            Move to Next Stage
          </Button>
        </div>
      </>
    );
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Telecalling", path: "/leads-telecalling" },
          { label: applicationId || "Telecalling Details" },
        ]}
      />
      <UserHeader
        permisssion={false}
        manualBtn={handleTelecalling}
        lead={lead}
      />
      {loading ? (
        <Loader text="Loading customer details..." />
      ) : error ? (
        <div
          role="alert"
          className="m-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : (
        <TelecallinWrapper
          key={`${customerId}-${applicationId}`}
          customerDetails={scopedDetails}
          onRefresh={refreshCustomerDetails}
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        title={"Confirm Submisiion"}
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onSubmit={() => {}}
      >
        <div className="py-2" onClick={(e) => e.stopPropagation()}>
          {/* Modal Body */}
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                Are you sure you want to move this application to the next
                stage?
              </p>
            </div>

            <div>
              <label
                htmlFor="stageRemark"
                className="mb-2 block text-sm font-medium text-ink-800"
              >
                Remarks <span className="text-rose-500">*</span>
              </label>

              <textarea
                id="stageRemark"
                name="remark"
                rows={4}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter your remarks..."
                className="w-full resize-none rounded-lg border border-primary bg-white p-3 text-sm text-ink-800 outline-primary transition focus:border-primary focus:ring-2 focus:ring-primary"
              />

              {!remark.trim() && (
                <p className="my-1 text-xs text-ink-500">
                  Please enter remarks before submitting.
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 border-t border-surface-border px-5 py-3">
            <Button
              style="text-sm border border-gray-300"
              variant="secondary"
              onClick={handleCloseConfirmModal}
            >
              Cancel
            </Button>

            <Button
              style="bg-primary text-white text-sm"
              onClick={handleTelecallingVerified}
              disabled={!remark.trim()}
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Telecalling;
