import Button from "./Button";
import Avatar, { StatusBadge } from "./common";
import JourneyStepper from "./JourneyStepper";
import LoanStatusSummary from "./LoanStatusSummary";

const UserHeader = ({ lead, permisssion }) => {
  console.log(lead);

  return (
    <div className="mb-0 overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
      {/* <div className="bg-[linear-gradient(120deg,#1F6F5F_0%,#2A835F_55%,#2FA084_100%)] px-5 pb-14 pt-5 sm:px-6"> */}
      <div className="bg-[linear-gradient(120deg,#5050b8_0%,#265FAA_55%,#3878C7_100%)] px-5 pb-14 pt-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={lead.name} size="lg" ring />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold text-white">
                  {lead.name}
                </h1>
                <StatusBadge
                  label={lead.status}
                  variant={
                    lead.stage === "rejected"
                      ? "danger"
                      : lead.stage === "draft"
                        ? "neutral"
                        : "primary"
                  }
                />
              </div>
              <p className="text-sm text-white/75">
                {lead.id} &middot; {lead.product} &middot; {lead.branch}{" "}
                &middot; ₹{lead.amount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          {permisssion && (
            <div className="flex gap-2">
              {lead.stage !== "rejected" ? (
                <>
                  <Button
                    btnIcon="IoCloseCircleOutline"
                    style="!border-white/40 !text-white hover:!bg-white/10 border !border-white rounded-md text-sm font-medium"
                    onClick={() => {}}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="secondary"
                    style="!border-white/0 !bg-white !text-primary hover:!bg-white/90 rounded-md text-sm font-medium"
                    onClick={() => {}}
                  >
                    Move to Next Stage
                  </Button>
                </>
              ) : (
                <span className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white/90">
                  {lead.rejectionReason}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="-mt-8 px-5 pb-5 sm:px-6">
        <div className="rounded-xl bg-white">
          {/* {lead?.stage == "active" || lead?.stage == "closed" ? ( */}
          {["active","closed","npa","due","overdue"]?.includes(lead?.stage) ? (
            <div>
              <LoanStatusSummary lead={lead} />
            </div>
          ) : (
            <div className="p-4 border border-surface-border rounded-xl shadow-raised">
              <JourneyStepper
                currentKey={lead.stage}
                rejectedAt={
                  lead.stage === "rejected" ? "credit-analysis" : null
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
