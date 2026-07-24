import React from "react";

// Mock Images object (replace with your actual imports)
const Images = {
  maleAvatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  femaleAvatar: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
};

const InfoCardSection = ({
  profileImage,
  gender,
  applicantData,
  selfieVerified,
  emailVerified,
  heading,
}) => {
  // Helper to capitalize words
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Filter important fields
  //   const importantFields = ['name', 'age', 'occupation', 'income', 'pan_number', 'aadhar_number', 'marital_status', 'education'];
  //   const filteredEntries = Object.entries(applicantData).filter(([key]) =>
  //     importantFields.includes(key)
  //   );

  //   const entries = filteredEntries.length > 0 ? filteredEntries : Object.entries(applicantData);

  const entries = Object.entries(applicantData);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-400/90 px-3 py-1 font-semibold text-gray-800 uppercase text-sm">
        {heading}
      </div>
      <div className="flex flex-col-reverse sm:flex-row">
        {/* Left Section - Applicant Info */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 p-4">
            {entries.map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col border-b border-gray-50 pb-1"
              >
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {capitalizeWords(key)}
                </label>
                <span className="text-xs text-gray-800 font-medium truncate">
                  {value || "N/A"}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-300 col-span-full my-2"></div>

            {/* Verification Status */}
            <div className="flex flex-col border-b border-gray-50">
              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Selfie Upload
              </label>
              <span
                className={`text-xs font-medium ${selfieVerified ? "text-green-600" : "text-red-500"}`}
              >
                {selfieVerified ? "✅ Verified" : "⏳ Pending"}
              </span>
            </div>

            <div className="flex flex-col border-b border-gray-50 pb-1">
              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Email Verification
              </label>
              <span
                className={`text-xs font-medium ${emailVerified ? "text-green-600" : "text-red-500"}`}
              >
                {emailVerified ? "✅ Verified" : "⏳ Pending"}
              </span>
            </div>

            <div className="flex flex-col border-b border-gray-50 pb-1">
              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Overall Status
              </label>
              <span
                className={`text-xs font-medium ${selfieVerified && emailVerified ? "text-green-600" : "text-yellow-600"}`}
              >
                {selfieVerified && emailVerified
                  ? "✅ Complete"
                  : "⏳ In Progress"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Profile Image */}
        <div className="sm:w-32 lg:w-40 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-gray-200">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 sm:w-25 sm:h-25 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  src={
                    profileImage ||
                    (gender === "male"
                      ? Images.maleAvatar
                      : Images.femaleAvatar)
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status Badge */}
              <div className="absolute -bottom-1 -right-1">
                <span
                  className={`w-4 h-4 rounded-full border-2 border-white inline-block ${
                    selfieVerified && emailVerified
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></span>
              </div>
            </div>

            <div className="mt-1">
              <h4 className="text-xs font-bold text-gray-800 truncate max-w-[80px] sm:max-w-[100px]">
                {applicantData?.name || "Applicant"}
              </h4>
              <p className="text-[10px] text-gray-500 truncate max-w-[80px] sm:max-w-[100px]">
                {applicantData?.occupation || "Occupation"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DEMO DATA
// ============================================

// Alternative demo data
export const demoApplicantData = {
  name: "Priya Singh",
  age: "28",
  occupation: "Doctor",
  income: "₹1,20,000",
  pan_number: "FGHIJ5678K",
  aadhar_number: "567890123456",
  father_name: "Dr. Ramesh Singh",
  mother_name: "Sneha Singh",
  marital_status: "Unmarried",
  education: "MBBS, MD",
  hospital_name: "Apollo Hospital",
  work_experience: "4 years",
  monthly_expenses: "₹60,000",
  existing_loans: "None",
  credit_score: "820",
};

const InfoCard = () => {
  return (
    <div className="container mx-auto">
      <InfoCardSection
        heading="Applicant Details"
        profileImage="https://randomuser.me/api/portraits/women/44.jpg"
        gender="female"
        applicantData={demoApplicantData}
        selfieVerified={false}
        emailVerified={true}
      />
    </div>
  );
};

export default InfoCard;
