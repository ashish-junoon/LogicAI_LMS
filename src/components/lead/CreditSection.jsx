import React, { useState } from "react";
import Icon from "../utils/Icon";
import SelectInput from "../fields/SelectInput";

const CreditSection = () => {
  const [creditScore, setCreditScore] = useState(null);
  const [generatedDate, setGeneratedDate] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFile, setShowFile] = useState(false);

  const creditData = {
    score: 720,
    rating: "Good",
    color: "#10B981",
    generatedOn: "2024-05-20 10:30 AM",
    fileUrl: "/credit-reports/LA-1250-credit-report.pdf",
    fileName: "Credit_Report_LA-1250.pdf",
  };

  const handleGenerateCredit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCreditScore(creditData.score);
      setGeneratedDate(creditData.generatedOn);
      setFileUrl(creditData.fileUrl);
      setIsGenerating(false);
      setShowFile(true);
    }, 2000);
  };

  const handleDownload = () => alert("Downloading credit report...");
  const handleView = () => alert("Opening credit report...");

  const getScoreColor = (score) => {
    if (score >= 750) return "#10B981";
    if (score >= 700) return "#3B82F6";
    if (score >= 650) return "#F59E0B";
    if (score >= 600) return "#F97316";
    return "#EF4444";
  };

  const getScoreRating = (score) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    if (score >= 600) return "Poor";
    return "Very Poor";
  };

  const getScoreBgColor = (score) => {
    if (score >= 750) return "bg-emerald-50 text-emerald-700";
    if (score >= 700) return "bg-blue-50 text-blue-700";
    if (score >= 650) return "bg-amber-50 text-amber-700";
    if (score >= 600) return "bg-orange-50 text-orange-700";
    return "bg-red-50 text-red-700";
  };

  return (
    <div className="py-2">
      {/* Compact Grid */}
      <div className="grid grid-cols-2 gap-1">
        {/* Left - Generate Section */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/5 to-primary/20 rounded-xl flex items-center justify-center mb-2.5">
              <Icon name="RiFileTextLine" size={28} color="#6D28D9" />
            </div>
            <h3 className="text-slate-800 font-semibold text-sm mb-0.5">
              Generate Report
            </h3>
            <p className="text-slate-500 text-xs text-center mb-3">
              Fetch latest credit score
            </p>
            <select
              // value={mode}
              // onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 mb-1"
            >
              <option value="">Select Mode</option>
              <option value="Crif">Crif</option>
              <option value="Experian">Experian</option>
            </select>

            <button
              onClick={handleGenerateCredit}
              disabled={isGenerating}
              className={`bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 cursor-pointer transition-all flex items-center gap-1.5 text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center`}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">
                    <Icon name="RiRefreshLine" size={16} color="#FFFFFF" />
                  </span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Icon name="RiFileTextLine" size={16} color="#FFFFFF" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right - Score Section */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
          {creditScore !== null ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div
                    className="w-25 h-25 rounded-full border-[8px] flex items-center justify-center shadow-md"
                    style={{ borderColor: getScoreColor(creditScore) }}
                  >
                    <div className="text-center">
                      <span
                        className="text-xl font-bold"
                        style={{ color: getScoreColor(creditScore) }}
                      >
                        {creditScore}
                      </span>
                      <span className="text-[12px] text-slate-500 block font-medium">
                        Score
                      </span>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-semibold shadow-sm ${getScoreBgColor(creditScore)}`}
                    >
                      {getScoreRating(creditScore)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div>
                    <p className="text-slate-500 text-[9px] font-medium uppercase tracking-wider">
                      Generated
                    </p>
                    <p className="text-slate-800 font-semibold text-[11px]">
                      {generatedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {showFile && fileUrl && (
                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                      File
                    </p>
                    <p className="text-slate-700 text-[12px] font-medium truncate">
                      {creditData.fileName}
                    </p>
                  </div>
                  <button
                    onClick={handleView}
                    className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[12px] font-medium hover:bg-slate-200 transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Icon name="RiEyeLine" size={12} color="#475569" />
                    View
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-primary text-white px-2.5 py-1 rounded-lg text-[12px] font-medium hover:bg-primary/90 cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Icon name="RiDownloadLine" size={12} color="#FFFFFF" />
                    Download
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-2.5">
                <Icon name="RiFileTextLine" size={24} color="#94A3B8" />
              </div>
              <p className="text-slate-600 font-medium text-xs">No Report</p>
              <p className="text-slate-400 text-[10px]">
                Generate to fetch score
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditSection;
