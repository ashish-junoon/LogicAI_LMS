import { useEffect, useState } from "react";

// Components
import VideoKYC from "../common/VideoKYC";
import DocumentsList from "./DocumentsList";
import Icon from "../utils/Icon";
import CreditSection from "./CreditSection";
import BankStatementAnalyser from "./BankStatementAnalyser ";
import RemarksHistory from "./RemarksHistory";
import LoanAnalysis from "./LoanAnalysis";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import SelectInput from "../fields/SelectInput";
import LeadFormDetails from "../../pages/formPages/LeadFormDetails";
import Variations from "./Variations";
import { useAuthData } from "../../context/authContext";
import { useLocation, useSearchParams } from "react-router-dom";
import DocumentVault from "../utils/DocumentVault";
import BSAReportUrl from "./BSAReportUrl";
import AccountAggregator from "./AccountAggregator";
import BusinessLoanCAM from "./BusinessLoanCAM";
import { GetAllVendors } from "../../api/mastersApi";
import { showValidationError } from "../utils/common";
import { SaveVendorMapping } from "../../api/application";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreditWrapper = ({ customerDetails, onRefresh }) => {
  const [activeSection, setActiveSection] = useState("user");
  const [switchLoanProvier, setswitchLoanProvier] = useState(false);
  const [vendorList, setvendorList] = useState([]);
  const [updatingVendor, setUpdatingVendor] = useState(false);

  // const [searchParams] = useSearchParams();
  // const customerId = searchParams.get("customer_id");
  // const applicationId = searchParams.get("application_id");
  const location = useLocation();
  const { customerId, applicationId } = location.state?.pera || {};
  const { authData } = useAuthData();

  const fetchAllVendors = async () => {
    try {
      const response = await GetAllVendors();
      if (response.status) {
        const transformedData = response?.data?.map((item) => ({
          label: item.vendor_name,
          value: item.id,
        }));
        setvendorList(transformedData);
      }
    } catch (error) {
      showValidationError(error);
    }
  };

  useEffect(() => {
    fetchAllVendors();
  }, []);

  const handleSwitchProvider = () => {
    switchProviderFormik.resetForm();
    setswitchLoanProvier(true);
  };

  const vendorValidationSchema = Yup.object({
    vendor_id: Yup.string().required("Please select loan provider"),
    remark: Yup.string()
      .trim()
      .min(10, "Remarks must be at least 10 characters")
      .max(500, "Remarks cannot exceed 500 characters")
      .required("Please enter remarks"),
  });

  const vendorFormik = useFormik({
    initialValues: {
      vendor_id: "",
      remark: "",
    },
    validationSchema: vendorValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      await handleUpdateVendorProvider(values, resetForm);
    },
  });

  const handleUpdateVendorProvider = async (values, resetForm) => {
    try {
      setUpdatingVendor(true);

      const req = {
        customer_id: customerId,
        application_id: applicationId,
        vendor_id: values.vendor_id,
        remark: values.remark.trim(),
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        created_by: authData?.user_id || "",
      };

      const response = await SaveVendorMapping(req);

      if (response?.status) {
        toast.success(response.message || "Vendor updated successfully");

        setswitchLoanProvier(false);
        resetForm();
        onRefresh?.();
      } else {
        toast.info(response?.message || "Unable to update vendor!");
      }
    } catch (error) {
      showValidationError(error);
    } finally {
      setUpdatingVendor(false);
    }
  };

  const permisions = {
    personalInfo: true,
    kycInfo: true,
    addressInfo: true,
    bankInfo: true,
    guarantorInfo: true,
    employementInfo: true,
  };

  const sections = [
    { id: "user", label: "User Details", icon: "RiShieldCheckLine" },
    { id: "loaninfo", label: "Loan Info", icon: "GiPayMoney" },
    { id: "cam", label: "CAM Report", icon: "PiGraph" },
    { id: "credit", label: "Credit Analysis", icon: "RiShieldCheckLine" },
    { id: "aa", label: "Account Aggregator", icon: "RiBankCardLine" },
    { id: "bsa", label: "Bank Statement Ananlysis", icon: "RiBankCardLine" },
    { id: "documents", label: "Documents", icon: "RiFileList3Line" },
    { id: "variations", label: "Variations", icon: "PiGraph" },
    { id: "remarks", label: "Remarks History", icon: "PiBookOpenTextDuotone" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "user":
        // return <LeadForm />;
        return (
          <LeadFormDetails
            permisions={permisions}
            customerDetails={customerDetails}
          />
        );
      case "credit":
        return (
          <CreditSection
            creditDetails={customerDetails?.cibilDetails}
            customerDetails={customerDetails}
          />
        );
      case "videoKyc":
        return <VideoKYC />;
      case "cam":
        return <BusinessLoanCAM />;
      case "loaninfo":
        return (
          <>
            <div className="flex justify-between items-center gap-2 mb-2 text-sm">
              <div className="flex items-center gap-2">
                <p className="text-gray-600  font-medium">Current: </p>
                <p className="text-gray-500">
                  {customerDetails?.vendorMappings?.[0]?.vendor_name}
                </p>
              </div>
              <Button
                btnIcon={"MdOutlineSwitchAccessShortcut"}
                style={"bg-primary text-white"}
                btnName={"Switch Vendor"}
                onClick={handleSwitchProvider}
              />
            </div>
            <LoanAnalysis
              permission={true}
              loanData={customerDetails?.loanDetails?.[0]}
              data={customerDetails}
              applicationId={customerDetails?.loanDetails?.[0]?.application_id}
            />
          </>
        );
      case "remarks":
        return (
          <RemarksHistory
            permission={true}
            remarks={customerDetails?.history || []}
          />
        );
      case "aa":
        return (
          <AccountAggregator
            customerDetailsData={customerDetails}
            userData={{
              name: customerDetails?.personalKyc?.[0]?.full_name,
              mobile:
                customerDetails?.marketSurvey?.[0]?.business_owner_mobile_no,
              pan: customerDetails?.personalKyc?.[0]?.pan_number,
              email: customerDetails?.personalKyc?.[0]?.email_id,
              dob: customerDetails?.personalKyc?.[0]?.dob,
              customerId: customerId,
              applicationId: applicationId,
            }}
            fetchData={onRefresh}
          />
        );
      case "bsa":
        // return <BankStatementAnalyser />;
        return (
          <div className="px-4 md:px-4">
            <BSAReportUrl
              userData={{
                name: customerDetails?.personalKyc?.[0]?.full_name,
                mobile:
                  customerDetails?.marketSurvey?.[0]?.business_owner_mobile_no,
                pan: customerDetails?.personalKyc?.[0]?.pan_number,
                email: customerDetails?.personalKyc?.[0]?.email_id,
                dob: customerDetails?.personalKyc?.[0]?.dob,
                customerId: customerId,
                applicationId: applicationId,
              }}
              data={customerDetails}
              getAccountAggregatorReport={{}}
              // getAccountAggregatorReport={getAccountAggregatorReport}
              fetchData={onRefresh}
            />
          </div>
        );
      case "variations":
        return <Variations />;
      case "documents":
        return (
          <DocumentVault
            documents={customerDetails?.documents ?? EMPTY_DOCUMENTS}
            customerDetails={customerDetails}
            customerId={customerId}
            applicationId={applicationId}
            userId={authData?.user_id}
            onDocumentsUploaded={onRefresh}
            onSubmitForm={() => {}}
            submittingForm={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* <div className="py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Sections
              </p>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary/5 text-primary font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <Icon
                        name={section.icon}
                        color={isActive ? "#8140DC" : "gray"}
                        // className={isActive ? "text-blue-500" : "text-gray-500"}
                        size={16}
                      />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">
                  {sections.find((s) => s.id === activeSection)?.label}
                </h3>
                <span className="text-[10px] text-gray-400">
                  {sections.findIndex((s) => s.id === activeSection) + 1} of{" "}
                  {sections.length}
                </span>
              </div>
              {renderSection()}
            </div>
          </div>
        </div>
      </div> */}

      <div className="py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-4">
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {sections.map((section) => {
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      name={section.icon}
                      color={isActive ? "#5050b8" : "gray"}
                      size={16}
                    />

                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-5">{renderSection()}</div>
        </div>
      </div>

      <Modal
        title="Update Loan Provider"
        isOpen={switchLoanProvier}
        onClose={() => {
          if (!updatingVendor) {
            setswitchLoanProvier(false);
            vendorFormik.resetForm();
          }
        }}
      >
        <form onSubmit={vendorFormik.handleSubmit} className="py-3 space-y-4">
          {/* Provider */}
          <div>
            <SelectInput
              options={vendorList}
              label="Select Loan Provider"
              placeholder="Select Loan Provider"
              value={vendorFormik.values.vendor_id}
              onChange={(value) =>
                vendorFormik.setFieldValue(
                  "vendor_id",
                  value?.value ?? value?.target?.value ?? value,
                )
              }
              onBlur={() => vendorFormik.setFieldTouched("vendor_id", true)}
            />

            {vendorFormik.touched.vendor_id &&
              vendorFormik.errors.vendor_id && (
                <p className="text-xs text-red-500 mt-1">
                  {vendorFormik.errors.vendor_id}
                </p>
              )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks <span className="text-red-500">*</span>
            </label>

            <textarea
              name="remark"
              rows={4}
              maxLength={500}
              placeholder="Enter reason for changing loan provider..."
              value={vendorFormik.values.remark}
              onChange={vendorFormik.handleChange}
              onBlur={vendorFormik.handleBlur}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
                vendorFormik.touched.remark && vendorFormik.errors.remark
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary"
              }`}
            />

            <div className="flex justify-between mt-1">
              {vendorFormik.touched.remark && vendorFormik.errors.remark ? (
                <p className="text-xs text-red-500">
                  {vendorFormik.errors.remark}
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  Minimum 10 characters required
                </p>
              )}

              <span className="text-xs text-gray-400">
                {vendorFormik.values.remark.length}/500
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              style="border border-gray-200 text-sm"
              btnName="Cancel"
              onClick={() => {
                setswitchLoanProvier(false);
                vendorFormik.resetForm();
              }}
            />

            <button
              type="submit"
              disabled={updatingVendor}
              className="bg-primary text-white text-sm px-5 py-2 rounded-lg disabled:opacity-50"
            >
              {updatingVendor ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreditWrapper;
