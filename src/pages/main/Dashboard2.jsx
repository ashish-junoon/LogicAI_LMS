import React, { useEffect, useMemo, useState } from "react";

import Overview from "../../components/dashboard/Overview";
import PortfolioHealth from "../../components/dashboard/PortfolioHealth";
import SectorsGeography from "../../components/dashboard/SectorsGeography";
import TeamPerformance from "../../components/dashboard/TeamPerformance";
import CustomerProfile from "../../components/dashboard/CustomerProfile";
import Collection from "../../components/dashboard/Collection";

import { Overview_MainAPI } from "../../api/functions";
import Icon from "../../components/utils/Icon";
import MultiCheckboxSelect from "../../components/fields/MultiCheckboxSelect";

// NOTE: this redesign assumes 'Inter' (sans) and 'IBM Plex Mono' (tabular
// data / KPI figures) are available — add once, globally, e.g. in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
// Both fall back to system fonts cleanly if omitted.

const Dashboard2 = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [mainData, setMainData] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  // =========================================================
  // TABS
  // =========================================================

  const tabs = [
    { id: "overview", label: "Overview", icon: "MdSpaceDashboard" },
    { id: "portfolio", label: "Portfolio Health", icon: "MdAccountBalance" },
    { id: "sectors", label: "Sectors & Geography", icon: "MdPublic" },
    { id: "customers", label: "Customer Profile", icon: "users" },
    { id: "collection", label: "Collection", icon: "book" },
  ];

  // =========================================================
  // PAGE
  // =========================================================

  const page = useMemo(() => {
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
        return <Overview mainData={mainData} />;
    }
  }, [activeTab, mainData]);

  // =========================================================
  // API
  // =========================================================

  const fetchOverview_Main = async () => {
    try {
      const req = { from_date: "", to_date: "" };
      const response = await Overview_MainAPI(req);
      if (response.status) {
        setMainData(response.data);
      }
    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  useEffect(() => {
    fetchOverview_Main();
  }, []);

  // =========================================================
  // PRODUCT OPTIONS
  // =========================================================

  const productOptions = [
    { label: "PaisaUdhar", value: "PU" },
    { label: "EarlyWages", value: "EW" },
    { label: "Instapaise", value: "IP" },
    { label: "Refyne", value: "RF" },
    { label: "MSME", value: "MSME" },
    { label: "SME", value: "SME" },
    { label: "JLG", value: "JLG" },
  ];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#EEF1F3] text-[#16202B] font-sans">
      {/* =====================================================
          TOP HEADER
      ====================================================== */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#DCE1E6]">
        <div className="flex min-h-[64px] items-center justify-between gap-4 px-4 sm:px-6">
          {/* Title */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary">
              <Icon name="MdSpaceDashboard" size={17} color="#3368A0" />
            </div>
            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-[15px] font-semibold text-[#16202B]">
                LMS Ledger
              </h1>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8B98A6] truncate">
                Loan Management System
              </p>
            </div>
          </div>

          {/* Ticker */}
          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[9.5px] uppercase tracking-[0.1em] text-[#8B98A6]">
                Loans
              </span>
              <span
                className="text-[13px] font-semibold text-[#16202B] tabular-nums"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {mainData?.total_loans?.toLocaleString() || 0}
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#DCE1E6]" />
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] uppercase tracking-[0.1em] text-[#8B98A6]">
                Disbursed
              </span>
              <span
                className="text-[13px] font-semibold text-[#96690F] tabular-nums"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                ₹
                {mainData?.total_disbursed
                  ? Math.floor(mainData.total_disbursed / 10000000).toLocaleString()
                  : 0}
                <span className="ml-0.5 text-[10px] font-medium">Cr</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          NAVIGATION / FILTER BAR
      ====================================================== */}
      <div className="sticky top-[64px] z-10 bg-[#EEF1F3]/95 backdrop-blur-sm border-b border-[#DCE1E6]">
        <div className="flex items-center gap-4 px-4 sm:px-6 py-0">
          {/* Tabs */}
          <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
            <div className="flex min-w-max items-center gap-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      "flex items-center gap-1.5 whitespace-nowrap px-3.5 py-3 text-[13px] font-medium border-b-2 -mb-px cursor-pointer transition-colors",
                      isActive
                        ? "border-[#3368A0] text-[#16202B]"
                        : "border-transparent text-[#8B98A6] hover:text-[#16202B]",
                    ].join(" ")}
                  >
                    <Icon
                      name={tab.icon}
                      size={15}
                      color={isActive ? "#3368A0" : "#8B98A6"}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product filter */}
          <div className="hidden sm:block w-[210px] shrink-0 py-2">
            <MultiCheckboxSelect
              label=""
              name="products"
              id="products"
              placeholder="All Products"
              options={productOptions}
              value={selectedProducts}
              onChange={(e) => setSelectedProducts(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile filter */}
        <div className="px-4 pb-3 sm:hidden">
          <MultiCheckboxSelect
            label=""
            name="products-mobile"
            id="products-mobile"
            placeholder="All Products"
            options={productOptions}
            value={selectedProducts}
            onChange={(e) => setSelectedProducts(e.target.value)}
          />
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6 py-5">
        {page}
      </main>
    </div>
  );
};

export default Dashboard2;
