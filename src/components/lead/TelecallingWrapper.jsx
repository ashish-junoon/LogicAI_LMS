import { useState } from "react";
import { toast } from "react-toastify";

// Components
import Icon from "../utils/Icon";
import RemarksHistory from "./RemarksHistory";
import DocumentVault from "../utils/DocumentVault";
import Variations from "./Variations";
import LeadFormDetails from "../../pages/formPages/LeadFormDetails";
import LiveKYC from "../common/LiveKYC";
import DocumentSignature from "../common/DocumentSignature";
import { SaveOtherDocuments } from "../../api/application";
import { convertFileToBase64 } from "../utils/common";
import { useAuthData } from "../../context/authContext";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const TelecallinWrapper = ({ customerDetails, onRefresh }) => {
  const [activeSection, setActiveSection] = useState("user");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState("");
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const { authData } = useAuthData();
  const marketSurvey = customerDetails?.marketSurvey?.[0] || {};
  const personalKyc = customerDetails?.personalKyc?.[0] || {};
  const loanDetails = customerDetails?.loanDetails?.[0] || {};
  const customerId =
    customerDetails?.customer_id || personalKyc.customer_id || marketSurvey.customer_id || loanDetails.customer_id;
  const applicationId =
    customerDetails?.application_id || personalKyc.application_id || marketSurvey.application_id || loanDetails.application_id;

  const permisions = {
    personalInfo: true,
    kycInfo: true,
    addressInfo: true,
    bankInfo: true,
    guarantorInfo: true,
    employementInfo: true,
  };

  const handleVideoUpload = async () => {
    setVideoUploadError("");
    if (!videoFile) {
      setVideoUploadError("Please select a video file first.");
      return;
    }
    if (!videoFile.type.startsWith("video/")) {
      setVideoUploadError("Please choose a valid video file.");
      return;
    }
    if (videoFile.size > MAX_VIDEO_SIZE) {
      setVideoUploadError("Video size must be under 100 MB.");
      return;
    }

    const marketSurvey = customerDetails?.marketSurvey?.[0] || {};
    const personalKyc = customerDetails?.personalKyc?.[0] || {};
    const loanDetails = customerDetails?.loanDetails?.[0] || {};
    const customerId =
      customerDetails?.customer_id ||
      personalKyc.customer_id ||
      marketSurvey.customer_id ||
      loanDetails.customer_id;
    const applicationId =
      customerDetails?.application_id ||
      personalKyc.application_id ||
      marketSurvey.application_id ||
      loanDetails.application_id;

    if (!customerId || !applicationId) {
      setVideoUploadError("Customer ID and application ID are required to upload video KYC.");
      return;
    }

    setVideoUploading(true);
    try {
      const base64Result = await convertFileToBase64(videoFile);
      // const base64 = String(base64Result).includes(",")
      //   ? String(base64Result).slice(String(base64Result).indexOf(",") + 1)
      //   : base64Result;
      const response = await SaveOtherDocuments({
        id: 0,
        customer_id: customerId,
        application_id: applicationId,
        document_type: "VIDEO_KYC",
        document_base64: base64Result,
        file_extension: videoFile.name.split(".").pop()?.toLowerCase() || "",
        is_active: true,
        creadted_by: authData?.user_id,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      });

      if (!response?.status) {
        throw new Error(response?.message || "Unable to upload Video KYC.");
      }

      const savedDocument =
        response?.data?.document || response?.data?.data || response?.data || {};
      const previewUrl = URL.createObjectURL(videoFile);
      setUploadedVideo({
        ...savedDocument,
        document_type: "VIDEO_KYC",
        file_name: savedDocument.file_name || videoFile.name,
        document_path:
          savedDocument.document_path || savedDocument.file_url || previewUrl,
      });
      setVideoFile(null);
      toast.success(response?.message || "Video KYC uploaded successfully.");
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Unable to upload Video KYC.";
      setVideoUploadError(message);
      toast.error(message);
    } finally {
      setVideoUploading(false);
    }
  };

  const existingVideoKyc = customerDetails?.documents?.find(
    (document) => document?.document_type?.toUpperCase() === "VIDEO_KYC",
  );
  const sections = [
      { id: "user", label: "User Details", icon: "PiBookOpenTextDuotone" },
      { id: "videokyc", label: "Video KYC", icon: "RiShieldCheckLine" },
      // { id: "esign", label: "e-Signature", icon: "FaSignature" },
      { id: "remarks", label: "Remarks History", icon: "PiBookOpenTextDuotone" },
      { id: "document", label: "Documents", icon: "PiBookOpenTextDuotone" },
      { id: "variations", label: "Variations", icon: "PiGraph" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "user":
        return <LeadFormDetails permisions={permisions} customerDetails={customerDetails} />;
      case "videokyc":
        return (
          <div className="space-y-4">
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Upload Video KYC</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Select a video file up to 100 MB.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="file"
                  accept="video/*"
                  disabled={videoUploading}
                  onChange={(event) => {
                    setVideoUploadError("");
                    setVideoFile(event.currentTarget.files?.[0] || null);
                  }}
                  className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={handleVideoUpload}
                  disabled={videoUploading || !videoFile}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {videoUploading ? "Uploading..." : "Upload video"}
                </button>
              </div>
              {videoFile && (
                <p className="mt-2 truncate text-xs text-slate-500">
                  Selected: {videoFile.name} · {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              )}
              {videoUploadError && (
                <p role="alert" className="mt-2 text-xs text-rose-600">
                  {videoUploadError}
                </p>
              )}
              {(uploadedVideo || existingVideoKyc) && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-emerald-800">Video KYC uploaded</p>
                    <p className="truncate text-[11px] text-emerald-700">
                      {(uploadedVideo || existingVideoKyc)?.file_name ||
                        (uploadedVideo || existingVideoKyc)?.document_path ||
                        "VIDEO_KYC"}
                    </p>
                  </div>
                  {(uploadedVideo || existingVideoKyc)?.document_path && (
                    <a
                      href={(uploadedVideo || existingVideoKyc).document_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                    >
                      View video
                    </a>
                  )}
                </div>
              )}
            </section>
            <LiveKYC />
          </div>
        );
      case "remarks":
        return <RemarksHistory permission={true} remarks={customerDetails?.history || []} />;
      case "esign":
        return <DocumentSignature />;
      case "variations":
        return <Variations />;
      case "document":
        return (
          <DocumentVault
            documents={customerDetails?.documents || []}
            customerDetails={customerDetails}
            customerId={customerId}
            applicationId={applicationId}
            userId={authData?.user_id}
            onDocumentsUploaded={onRefresh}
          />
        );
      default:
        return null;
    }
  };

  return (
    // <div className="py-4">
    //   <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
    //     {/* Sidebar Navigation */}
    //     <div className="lg:col-span-1">
    //       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
    //         <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
    //           Sections
    //         </p>
    //         <nav className="space-y-1">
    //           {sections.map((section) => {
    //             const isActive = activeSection === section.id;
    //             return (
    //               <button
    //                 key={section.id}
    //                 onClick={() => setActiveSection(section.id)}
    //                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
    //                   isActive
    //                     ? "bg-primary/5 text-primary font-medium"
    //                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
    //                 }`}
    //               >
    //                 <Icon
    //                   name={section.icon}
    //                   color={isActive ? "#5050b8" : "gray"}
    //                   size={16}
    //                 />
    //                 {section.label}
    //               </button>
    //             );
    //           })}
    //         </nav>
    //       </div>
    //     </div>

    //     {/* Content Area */}
    //     <div className="lg:col-span-3">
    //       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
    //         <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
    //           <h3 className="text-sm font-semibold text-gray-800">
    //             {sections.find((s) => s.id === activeSection)?.label}
    //           </h3>
    //           <span className="text-[10px] text-gray-400">
    //             {sections.findIndex((s) => s.id === activeSection) + 1} of{" "}
    //             {sections.length}
    //           </span>
    //         </div>
    //         {renderSection()}
    //       </div>
    //     </div>
    //   </div>
    // </div>
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
        
        <div className="p-5">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default TelecallinWrapper;
