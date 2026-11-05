import { useState } from "react";
import { useLoanDetails } from "../../provider/loanContext";
import Button from "./Button";
import Avatar, { StatusBadge } from "./common";
import JourneyStepper from "./JourneyStepper";
import LoanStatusSummary from "./LoanStatusSummary";
import { toast } from "react-toastify";
import { SettingApplicationStep } from "../../api/application.js";
import Loader from "./Loader";
import { useAuthData } from "../../context/authContext";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal.jsx";

const UserHeader = ({ lead, permisssion, manualBtn }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const routeLead = location.state?.lead;

  const customerId = searchParams.get("customer_id") || routeLead?.customer_id;

  const applicationId =
    searchParams.get("application_id") || routeLead?.application_id;

  const { authData } = useAuthData();

  const handleOpenConfirmModal = () => {
    setRemark("");
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    if (loading) return;

    setShowConfirmModal(false);
    setRemark("");
  };

  const handleMoveLeadNext = async () => {
    if (!remark.trim()) {
      toast.warning("Please enter remarks before proceeding.");
      return;
    }

    setLoading(true);

    try {
      const req = {
        customer_id: customerId,
        application_id: applicationId,
        from_step: lead?.app_form_status,
        to_step: Number(lead?.app_form_status) + 1,
        role: authData?.role,
        reason: "Application verified & Submitted.",
        remark: remark.trim(),
        created_by: authData?.user_id,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      };

      const response = await SettingApplicationStep(req);

      if (!response?.status) {
        toast.info(response?.message || "Unable to submit the application.");
        return;
      }

      toast.success(response?.message || "Application submitted successfully.");

      setShowConfirmModal(false);
      setRemark("");

      navigate(-1);
    } catch (error) {
      showValidationError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRejectModal = () => {
    setRemark("");
    setIsRejecting(true);
    setShowConfirmModal(true);
  };

  const handleRejectLead = async () => {
    if (!remark.trim()) {
      toast.warning("Please enter remarks before rejecting.");
      return;
    }

    setLoading(true);

    try {
      const response = await SettingApplicationStep({
        customer_id: customerId,
        application_id: applicationId,
        from_step: lead?.app_form_status,
        to_step: 0,
        role: authData?.role,
        reason: "Application Rejected",
        remark: remark.trim(),
        created_by: authData?.user_id,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      });

      if (!response?.status) {
        toast.error(response?.message || "Unable to reject application.");
        return;
      }

      toast.success(response?.message || "Application rejected successfully.");

      setShowConfirmModal(false);
      setRemark("");

      navigate(-1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mb-0 overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
        {/* Header */}
        <div className="bg-[linear-gradient(120deg,#5050b8_0%,#265FAA_55%,#3878C7_100%)] px-5 pb-14 pt-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                name={lead?.customer_name || lead?.business_owner_name}
                size="lg"
                ring
              />

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-semibold text-white">
                    {lead?.customer_name ||
                      lead?.business_owner_name ||
                      "Customer"}
                  </h1>

                  <StatusBadge
                    label={lead?.loan_status}
                    app_status={lead?.app_form_status}
                    variant={
                      lead?.loan_status === "rejected"
                        ? "danger"
                        : lead?.stage === "draft"
                          ? "neutral"
                          : "primary"
                    }
                  />
                </div>

                <p className="text-sm text-white/75">
                  {lead?.loan_id || lead?.application_id || "-"}
                  &middot; {lead?.product_code || "-"}
                  &middot;{" "}
                  {lead?.loan_amount != null
                    ? `₹${Number(lead.loan_amount).toLocaleString("en-IN")}`
                    : "-"}
                </p>
              </div>
            </div>

            {manualBtn ? manualBtn?.() : ""}

            {permisssion && (
              <div className="flex gap-2">
                {lead?.stage !== "rejected" ? (
                  <>
                    <Button
                      btnIcon="IoCloseCircleOutline"
                      style="!border-white/40 !text-white hover:!bg-white/10 border !border-primary rounded-md text-sm font-medium"
                      onClick={handleOpenRejectModal}
                    >
                      Reject
                    </Button>

                    <Button
                      variant="secondary"
                      style="!border-white/0 !bg-white !text-primary hover:!bg-white/90 rounded-md text-sm font-medium"
                      onClick={handleOpenConfirmModal}
                    >
                      Move to Next Stage
                    </Button>
                  </>
                ) : (
                  <span className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white/90">
                    {lead?.rejectionReason}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loan Summary / Journey Stepper */}
        <div className="-mt-8 px-5 pb-5 sm:px-6">
          <div className="rounded-xl bg-white">
            {["active", "closed", "npa", "due", "overdue"].includes(
              (lead?.status || lead?.loan_status || "").toLowerCase(),
            ) ? (
              <div>
                <LoanStatusSummary lead={lead} />
              </div>
            ) : (
              <div className="rounded-xl border border-surface-border p-4 shadow-raised">
                <JourneyStepper
                  app_status={lead?.app_form_status}
                  rejectedAt={lead?.stage === "rejected" ? 4 : null}
                />
              </div>
            )}
          </div>
        </div>
      </div>

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
              onClick={handleMoveLeadNext}
              disabled={!remark.trim()}
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title={isRejecting ? "Confirm Rejection" : "Confirm Submission"}
        isOpen={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onSubmit={isRejecting ? handleRejectLead : handleMoveLeadNext}
      >
        <div className="py-2" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-4">
            <div
              className={`rounded-lg border p-3 ${
                isRejecting
                  ? "border-red-100 bg-red-50"
                  : "border-blue-100 bg-blue-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isRejecting ? "text-red-700" : "text-blue-800"
                }`}
              >
                {isRejecting
                  ? "Are you sure you want to reject this application?"
                  : "Are you sure you want to move this application to the next stage?"}
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
                placeholder={
                  isRejecting
                    ? "Enter rejection reason..."
                    : "Enter your remarks..."
                }
                className="w-full resize-none rounded-lg border border-primary bg-white p-3 text-sm text-ink-800 outline-primary transition focus:border-primary focus:ring-2 focus:ring-primary"
              />

              {!remark.trim() && (
                <p className="my-1 text-xs text-ink-500">
                  Please enter remarks before submitting.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-surface-border px-5 py-3">
            <Button
              style="text-sm border border-gray-300"
              variant="secondary"
              onClick={handleCloseConfirmModal}
            >
              Cancel
            </Button>

            <Button
              style={
                isRejecting
                  ? "bg-red-600 text-white text-sm"
                  : "bg-primary text-white text-sm"
              }
              onClick={isRejecting ? handleRejectLead : handleMoveLeadNext}
              disabled={!remark.trim() || loading}
            >
              {isRejecting ? "Confirm Rejection" : "Confirm & Submit"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserHeader;
