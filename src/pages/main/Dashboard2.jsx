import React, { useEffect, useState } from "react";
import Overview from "../../components/dashboard/Overview";
import PortfolioHealth from "../../components/dashboard/PortfolioHealth";
import SectorsGeography from "../../components/dashboard/SectorsGeography";
import TeamPerformance from "../../components/dashboard/TeamPerformance";
import CustomerProfile from "../../components/dashboard/CustomerProfile";
import { Overview_MainAPI } from "../../api/functions";
import { formatNumber } from "../../components/dashboard/Helper";
import Collection from "../../components/dashboard/Collection";
import Icon from "../../components/utils/Icon";

const Dashboard2 = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [mainData, setMainData] = useState({});

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "portfolio", label: "Portfolio Health" },
    { id: "sectors", label: "Sectors & Geography" },
    // { id: "team", label: "Team Performance" },
    { id: "customers", label: "Customer Profile" },
    // { id: "collection", label: "Collection" },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case "overview":
        return <Overview mainData={mainData} />;
      case "portfolio":
        return <PortfolioHealth />;
      case "sectors":
        return <SectorsGeography />;
      case "team":
        return <TeamPerformance />;
      case "customers":
        return <CustomerProfile />;
      case "collection":
        return <Collection />;
      default:
        return <Overview />;
    }
  };

  const fetchOverview_Main = async () => {
    try {
      const req = {
        from_date: "",
        to_date: "",
      };

      const response = await Overview_MainAPI(req);
      if (response.status) {
        setMainData(response.data);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    fetchOverview_Main();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 text-sm">
      <header className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center">
            <Icon name="MdSpaceDashboard" size={18} color="white" />
          </div>
          <div className="leading-tight">
            <h1 className="text-[15px] font-bold text-slate-700">
              LMS Dashboard
            </h1>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5">
              Loan Management System
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-50 border border-slate-200/50">
            <Icon name="users" size={11} color="#64748b" />
            <span className="font-medium text-slate-700">
              {mainData?.total_loans?.toLocaleString() || 0} Loans
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 border border-indigo-200/50">
            <Icon name="book" size={11} color="#4f46e5" />
            <span className="font-semibold text-indigo-600">
              ₹
              {mainData?.total_disbursed
                ? Math.floor(mainData.total_disbursed / 10000).toLocaleString()
                : 0}
            </span>
            <span className="text-indigo-400 font-semibold">Cr</span>
          </div>
        </div>
      </header>

      {/* <nav className="max-w-[1400px] mx-auto px-6 border-b border-slate-200">
        <div className="flex gap-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-4 text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}

              {activeTab === tab.id && (
                <span className="absolute left-0 bottom-0 h-[3px] w-full rounded-full bg-blue-600"></span>
              )}
            </button>
          ))}
        </div>
      </nav> */}

<nav className="max-w-[1400px] mx-auto px-4 py-3 border-b border-gray-200 shadow bg-white">
  <div className="overflow-x-auto no-scrollbar">
    <div className="inline-flex min-w-max gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
            activeTab === tab.id
              ? "bg-blue-600 text-white shadow"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
</nav>

      {/* Content */}
      <main className="px-2 sm:px-4 py-4 max-w-[1400px] mx-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default Dashboard2;
