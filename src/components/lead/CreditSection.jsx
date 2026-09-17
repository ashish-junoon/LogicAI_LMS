import React, { useState } from "react";
import Icon from "../utils/Icon";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";

const CreditSection = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Raju Das",
      email: "john@example.com",
      softPull: {
        creditScore: 12,
        generatedDate: "2024-05-20 10:30 AM",
        fileUrl: "/credit-reports/soft-pull-report.pdf",
        fileName: "Soft_Pull_Report.pdf",
        showFile: true,
        isGenerating: false,
        selectedMode: "Crif",
        lastRefreshed: "2024-05-20 10:30 AM",
      },
      hardPull: {
        creditScore: null,
        generatedDate: null,
        fileUrl: null,
        fileName: null,
        showFile: false,
        isGenerating: false,
        selectedMode: "",
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      softPull: {
        creditScore: null,
        generatedDate: "2024-05-19 02:15 PM",
        fileUrl: "/credit-reports/soft-pull-report-2.pdf",
        fileName: "Soft_Pull_Report_2.pdf",
        showFile: true,
        isGenerating: false,
        selectedMode: "Experian",
        lastRefreshed: "2024-05-19 02:15 PM",
      },
      hardPull: {
        creditScore: null,
        generatedDate: null,
        fileUrl: null,
        fileName: null,
        showFile: false,
        isGenerating: false,
        selectedMode: "",
      },
    },
  ]);

  const handleGenerateCredit = (userId, pullType, isRefetch = false) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              [pullType]: {
                ...user[pullType],
                isGenerating: true,
              },
            }
          : user,
      ),
    );

    // Simulate API call
    setTimeout(() => {
      // Generate new random score (slightly different from existing for realism)
      const existingScore = users.find(u => u.id === userId)?.[pullType]?.creditScore || 0;
      let newScore;
      
      if (isRefetch && existingScore > 0) {
        // For refetch, vary by ±20 points
        const variation = Math.floor(Math.random() * 41) - 20; // -20 to +20
        newScore = Math.min(850, Math.max(300, existingScore + variation));
      } else {
        // For new fetch, random score
        newScore = Math.ceil(Math.random() * 250 + 550);
      }

      const now = new Date();
      const generatedOn = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const fileName = pullType === 'softPull' 
        ? `Soft_Pull_Report_${Date.now()}.pdf`
        : `Hard_Pull_Report_${Date.now()}.pdf`;
      
      const fileUrl = `/credit-reports/${fileName}`;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                [pullType]: {
                  ...user[pullType],
                  creditScore: newScore,
                  generatedDate: generatedOn,
                  fileUrl: fileUrl,
                  fileName: fileName,
                  isGenerating: false,
                  showFile: true,
                  lastRefreshed: isRefetch ? generatedOn : user[pullType]?.lastRefreshed || generatedOn,
                },
              }
            : user,
        ),
      );
    }, 1500);
  };

  const handleDownload = (userId, pullType) => {
    const user = users.find(u => u.id === userId);
    const pullData = user[pullType];
    alert(`Downloading ${pullType === 'softPull' ? 'Soft Pull' : 'Hard Pull'} report for ${user.name}...\nFile: ${pullData.fileName}`);
  };

  const handleView = (userId, pullType) => {
    const user = users.find(u => u.id === userId);
    const pullData = user[pullType];
    alert(`Opening ${pullType === 'softPull' ? 'Soft Pull' : 'Hard Pull'} report for ${user.name}...\nFile: ${pullData.fileName}`);
  };

  const handleModeChange = (userId, pullType, mode) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              [pullType]: {
                ...user[pullType],
                selectedMode: mode,
              },
            }
          : user,
      ),
    );
  };

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
    return "bg-red-100 text-red-700";
  };

  const renderPullSection = (user, pullType) => {
    const pullData = user[pullType];
    const isSoftPull = pullType === 'softPull';
    const hasScore = pullData.creditScore !== null;

    return (
      <div className={`border ${isSoftPull ? 'border-emerald-200 bg-emerald-50/30' : 'border-blue-200 bg-blue-50/30'} rounded-lg p-3`}>
        {/* Header with Pull Type */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {/* <div className={`w-6 h-6 rounded-full ${isSoftPull ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} flex items-center justify-center text-[10px] font-bold`}>
              {isSoftPull ? 'S' : 'H'}
            </div> */}
            <span className={`text-xs font-semibold ${isSoftPull ? 'text-emerald-700' : 'text-blue-700'}`}>
              {isSoftPull ? 'Soft Pull' : 'Hard Pull'}
            </span>
            {hasScore && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-semibold ${getScoreBgColor(pullData.creditScore)}`}>
                {getScoreRating(pullData.creditScore)}
              </span>
            )}
          </div>
          {!isSoftPull && (
            <span className="text-[8px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              Requires Consent
            </span>
          )}
        </div>

        {/* Score and Generate Section */}
        <div className="flex items-center gap-2">
          {/* Score Display or Placeholder */}
          <div className="flex-shrink-0">
            {hasScore ? (
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full border-[4px] flex items-center justify-center shadow-sm bg-white"
                  style={{ borderColor: getScoreColor(pullData.creditScore) }}
                >
                  <div className="text-center">
                    <span
                      className="text-sm font-bold"
                      style={{ color: getScoreColor(pullData.creditScore) }}
                    >
                      {pullData.creditScore}
                    </span>
                  </div>
                </div>
                {/* {isSoftPull && pullData.lastRefreshed && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="text-[6px] text-slate-400 bg-white px-1 py-0.5 rounded border border-slate-100">
                      Refreshed: {pullData.lastRefreshed.split(' ').slice(0,2).join(' ')}
                    </span>
                  </div>
                )} */}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-white">
                <span className="text-[8px] text-slate-400 text-center leading-tight">
                  No<br/>Score
                </span>
              </div>
            )}
          </div>

          {/* Right side content */}
          <div className="flex-1 min-w-0">
            {hasScore ? (
              // Show score details and actions
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-800 text-[9px] font-bold uppercase tracking-wider">
                      Generated
                    </p>
                    <p className="text-slate-800 font-medium text-[10px] truncate">
                      {pullData.generatedDate}
                    </p>
                  </div>
                  
                  {/* Refetch button for Soft Pull */}
                  {isSoftPull && (
                    <button
                      onClick={() => handleGenerateCredit(user.id, pullType, true)}
                      disabled={pullData.isGenerating}
                      className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-semibold hover:bg-emerald-200 transition-all flex items-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pullData.isGenerating ? (
                        <>
                          <span className="animate-spin">
                            <Icon name="RiRefreshLine" size={12} color="#065F46" />
                          </span>
                          <span>Refreshing</span>
                        </>
                      ) : (
                        <>
                          <Icon name="RiRefreshLine" size={12} color="#065F46" />
                          <span>Refetch</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {pullData.showFile && pullData.fileUrl && (
                  <div className="flex items-center gap-1 mt-1 pt-1 border-t border-slate-200">
                    <p className="text-slate-700 text-[10px] font-medium truncate flex-1">
                      {pullData.fileName}
                    </p>
                    <button
                      onClick={() => handleView(user.id, pullType)}
                      className="bg-slate-200/80 text-slate-700 px-1.5 py-1 rounded text-[8px] font-medium hover:bg-slate-300 transition-all cursor-pointer"
                    >
                      <Icon name="RiEyeLine" size={12} color="#475569" />
                    </button>
                    <button
                      onClick={() => handleDownload(user.id, pullType)}
                      className="bg-primary text-white px-1.5 py-1 rounded text-[8px] font-medium hover:bg-primary/90 transition-all cursor-pointer"
                    >
                      <Icon name="RiDownloadLine" size={12} color="#FFFFFF" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Show generate controls for hard pull
              <div className="space-y-1.5">
                <SelectInput
                  placeholder="Select Mode"
                  value={pullData.selectedMode}
                  onChange={(e) => handleModeChange(user.id, pullType, e.target.value)}
                  options={[
                    { label: "Crif", value: "Crif" },
                    { label: "Experian", value: "Experian" },
                  ]}
                  className="!text-[10px] !py-1 !px-2"
                />
                <Button
                  onClick={() => handleGenerateCredit(user.id, pullType, false)}
                  disabled={pullData.isGenerating || !pullData.selectedMode}
                  style={`w-full ${isSoftPull ? 'bg-primary hover:bg-primary/80' : 'bg-primary hover:bg-primary/80'} cursor-pointer text-white px-2 py-1.5 rounded text-[10px] font-semibold transition-all flex items-center justify-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pullData.isGenerating ? (
                    <>
                      <span className="animate-spin">
                        <Icon name="RiRefreshLine" size={12} color="#FFFFFF" />
                      </span>
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="RiFileTextLine" size={12} color="#FFFFFF" />
                      <span>Fetch Score</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-0 space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 hover:shadow-md transition-shadow"
        >
          {/* User Header */}
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 leading-tight">
                  {user.name}
                </p>
              </div>
            </div>
          </div>

          {/* Two-column layout for Soft and Hard Pull */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-2">
            {/* Soft Pull Section */}
            {renderPullSection(user, 'softPull', 'Soft Pull')}
            
            {/* Hard Pull Section */}
            {renderPullSection(user, 'hardPull', 'Hard Pull')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreditSection;