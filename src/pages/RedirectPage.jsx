import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GetAadhaarDetailById } from "../api/kycApi";
import { useAuthData } from "../context/authContext";

const RedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");
  const type = searchParams.get("type");

  const [loading, setLoading] = useState(true);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [error, setError] = useState("");

  const {authData} = useAuthData()

  useEffect(() => {
    if (type !== "aadhaar" || !id) {
      setError("Invalid redirect URL.");
      setLoading(false);
      return;
    }

    const fetchAadhaarDetails = async () => {
      try {
        const req = {
          unique_request_number: id,
          company_id: "LOS",
          product_name: "LOS",
          kyc_type: "AADHAAR_DETAIL",
          created_by: authData?.user_id || "USER",
        };

        const response = await GetAadhaarDetailById(req);

        // Store the complete API response
        if (response?.status) {
          setAadhaarData(response);
        } else {
          setAadhaarData(response);
          setError(response?.message || "Unable to fetch Aadhaar details.");
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong while verifying Aadhaar."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAadhaarDetails();
  }, [id, type]);

  // Access data inside the complete response
  const responseData = aadhaarData?.data;
  const isSuccess = responseData?.status === "success";

  const handleGoBack = () => {
    const customerId = aadhaarData?.customer_id;
    const applicationId = aadhaarData?.application_id;

    if (customerId && applicationId) {
      navigate(
        `/add-application?customer_id=${encodeURIComponent(customerId)}&application_id=${encodeURIComponent(applicationId)}&redirected=1`
      );
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        {loading ? (
          <>
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h2 className="text-xl font-semibold text-slate-800">
              Verifying Aadhaar
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch your verification status.
            </p>
          </>
        ) : isSuccess ? (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                className="h-9 w-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M5 12.5 9.5 17 19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-emerald-700">
              Aadhaar Verification Successful
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              {
                "Your Aadhaar verification has been completed successfully."}
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <svg
                className="h-9 w-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 8v5m0 4h.01M10.3 3.9 1.8 18.5A2 2 0 0 0 3.3 21h17.4a2 2 0 0 0 1.5-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-rose-700">
              Aadhaar Verification Failed
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              {responseData?.failure_reason ||
                error ||
                "Aadhaar verification could not be completed."}
            </p>
          </>
        )}

        {!loading && (
          <button
            type="button"
            onClick={handleGoBack}
            className="mt-7 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
};

export default RedirectPage;