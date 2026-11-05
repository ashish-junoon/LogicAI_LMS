import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuthData } from "../../context/authContext";
import { useSearchParams } from "react-router-dom";
import { SaveOtherDocuments } from "../../api/application";
import { convertFileToBase64 } from "../utils/common";

const UploadDisbursment = ({customerDetails}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const {authData} = useAuthData()

      const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customer_id");
  const applicationId = searchParams.get("application_id");

  const allowedExtensions = ["xlsx", "xls", "csv"];
  const maxFileSize = 10 * 1024 * 1024;

  const DISBURSEMENT_FILE = customerDetails?.documents.filter((file)=> file.document_type == "DISBURSEMENT_FILE")
  console.log(DISBURSEMENT_FILE)

  const validateFile = (file) => {
    if (!file) return false;

    const extension = file.name.split(".").pop().toLowerCase();

    // if (!allowedExtensions.includes(extension)) {
    //   toast.error("Only XLSX, XLS and CSV files are allowed.");
    //   return false;
    // }

    if (file.size > maxFileSize) {
      toast.error("File size should not exceed 10 MB.");
      return false;
    }

    return true;
  };

  const handleFileChange = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a disbursement file.");
      return;
    }

    if (!customerId || !applicationId) {
      toast.error("Customer ID and Application ID are required.");
      return;
    }

    try {
      setLoading(true);

      const documentBase64 = await convertFileToBase64(selectedFile)
      const extension = selectedFile.name.split(".").pop().toLowerCase();

      const response = await SaveOtherDocuments({
        id: 0,
        customer_id: customerId,
        application_id: applicationId,
        document_type: `DISBURSEMENT_FILE`,
        document_base64: documentBase64,
        file_extension: extension,
        is_active: true,
        creadted_by: authData.user_id,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      });

      if (response?.status) {
        toast.success(
          response?.message || "Disbursement file uploaded successfully."
        );

        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(response?.message || "Disbursement upload failed.");
      }
    } catch (error) {
      console.error("Disbursement upload error:", error);
      toast.error("Something went wrong while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} Bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800">
          Upload Disbursement File
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Manually upload disbursement details for an individual customer.
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* File Upload */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-primary bg-green-50"
              : "border-gray-300 hover:border-primary hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            // accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />

          <p className="text-sm font-medium text-gray-700">
            Click to browse or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Excel or CSV files (Maximum 10 MB)
          </p>
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="text-xs font-medium text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload Disbursement"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDisbursment;