import React, { useState } from "react";
import Icon from "../utils/Icon";
import SelectInput from "../fields/SelectInput";

const BankStatementAnalyser = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Mock analysis data
  const analysisData = {
    fileName: "Bank_Statement_2024.pdf",
    fileSize: "2.4 MB",
    uploadedOn: "2024-05-20 10:30 AM",
    status: "Completed",
    summary: {
      totalDeposits: "₹45,80,000",
      totalWithdrawals: "₹38,20,000",
      closingBalance: "₹12,45,000",
      avgBalance: "₹8,75,000",
      transactions: 156,
      analysisDate: "2024-05-20 11:45 AM"
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisStatus("File uploaded");
      setShowResult(false);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      alert("Please upload a bank statement first");
      return;
    }
    
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(analysisData);
      setAnalysisStatus("Analysis completed");
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2500);
  };

  const handleDownload = () => alert("Downloading analysis report...");
  const handleView = () => alert("Viewing detailed analysis...");

  return (
    <div className="py-2">
      {/* Compact Grid */}
      <div className="grid grid-cols-2 gap-1">
        {/* Left - Upload & Analyze Section */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center mb-2.5">
              <Icon name="RiUploadCloud2Line" size={28} color="#059669" />
            </div>
            <h3 className="text-slate-800 font-semibold text-sm mb-0.5">
              Upload & Analyze
            </h3>
            <p className="text-slate-500 text-xs text-center mb-3">
              Upload bank statement for analysis
            </p>

            {/* File Upload */}
            <div className="w-full mb-2">
              <label className="flex items-center justify-center w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-all bg-slate-50 hover:bg-slate-100">
                <input
                  type="file"
                  accept=".pdf,.csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <Icon name="RiFileUploadLine" size={16} color="#64748B" />
                  <span className="text-xs text-slate-600 font-medium">
                    {selectedFile ? selectedFile.name : "Choose file"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {selectedFile && `(${(selectedFile.size / 1024 / 1024).toFixed(1)} MB)`}
                  </span>
                </div>
              </label>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className={`bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 cursor-pointer transition-all flex items-center gap-1.5 text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center ${
                !selectedFile ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin">
                    <Icon name="RiRefreshLine" size={16} color="#FFFFFF" />
                  </span>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Icon name="RiBarChartLine" size={16} color="#FFFFFF" />
                  <span>Analyze</span>
                </>
              )}
            </button>

            {selectedFile && (
              <div className="mt-2 w-full">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 w-full">
                  <Icon name="RiCheckboxCircleLine" size={14} color="#3B82F6" />
                  <span className="text-blue-700 text-[11px] font-medium">
                    File uploaded successfully
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Result Section */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4">
          {showResult && analysisResult ? (
            <div className="flex flex-col h-full">
              {/* File Info */}
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Icon name="RiFilePdfLine" size={16} color="#EF4444" />
                  <span className="text-xs font-medium text-slate-700 truncate">
                    {analysisResult.fileName}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                  {analysisResult.status}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-1.5 flex-1">
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">
                    Deposits
                  </p>
                  <p className="text-sm font-bold text-emerald-600">
                    {analysisResult.summary.totalDeposits}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">
                    Withdrawals
                  </p>
                  <p className="text-sm font-bold text-red-600">
                    {analysisResult.summary.totalWithdrawals}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">
                    Balance
                  </p>
                  <p className="text-sm font-bold text-blue-600">
                    {analysisResult.summary.closingBalance}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider">
                      Transactions
                    </p>
                    <p className="text-[11px] font-semibold text-slate-700">
                      {analysisResult.summary.transactions}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider">
                      Avg Balance
                    </p>
                    <p className="text-[11px] font-semibold text-slate-700">
                      {analysisResult.summary.avgBalance}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleView}
                    className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-[10px] font-medium hover:bg-slate-200 transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Icon name="RiEyeLine" size={12} color="#475569" />
                    View
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-[10px] font-medium hover:bg-emerald-700 cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Icon name="RiDownloadLine" size={12} color="#FFFFFF" />
                    DL
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-2.5">
                <Icon name="RiFileTextLine" size={24} color="#94A3B8" />
              </div>
              <p className="text-slate-600 font-medium text-xs">No Analysis</p>
              <p className="text-slate-400 text-[10px]">
                Upload and analyze to view results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankStatementAnalyser;