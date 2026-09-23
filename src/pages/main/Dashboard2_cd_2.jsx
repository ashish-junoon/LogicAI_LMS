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

const Dashboard2 = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [mainData, setMainData] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  // =========================================================
  // TABS
  // =========================================================

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "MdSpaceDashboard",
    },
    {
      id: "portfolio",
      label: "Portfolio Health",
      icon: "MdAccountBalance",
    },
    {
      id: "sectors",
      label: "Sectors & Geography",
      icon: "MdPublic",
    },
    {
      id: "customers",
      label: "Customer Profile",
      icon: "users",
    },
    {
      id: "collection",
      label: "Collection",
      icon: "book",
    },
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
      const req = {
        from_date: "",
        to_date: "",
      };

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
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =====================================================
          TOP HEADER
      ====================================================== */}
      <header
        className="
          sticky top-0 z-20
          border-b border-slate-200/70
          bg-white/80
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-white/70
        "
      >
        <div
          className="
            flex min-h-[68px]
            items-center justify-between
            gap-4
            px-4 sm:px-6
          "
        >

          {/* -------------------------------------------------
              TITLE
          -------------------------------------------------- */}
          <div className="flex min-w-0 items-center gap-3">

            {/* Icon */}
            <div
              className="
                relative flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br from-primary to-indigo-600
                shadow-[0_8px_18px_-6px_rgba(21,88,189,0.55)]
              "
            >
              <Icon
                name="MdSpaceDashboard"
                size={20}
                color="#ffffff"
              />
            </div>

            {/* Heading */}
            <div className="min-w-0 leading-tight">
              <h1
                className="
                  truncate
                  text-[16px]
                  font-bold
                  tracking-tight
                  text-slate-800
                "
              >
                LMS Dashboard
              </h1>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Loan Management System
              </p>
            </div>
          </div>

          {/* -------------------------------------------------
              SUMMARY
          -------------------------------------------------- */}
          <div className="flex shrink-0 items-center gap-2">

            {/* Loans */}
            <div
              className="
                hidden sm:flex
                items-center gap-2
                rounded-2xl
                border border-slate-200/70
                bg-white
                px-3 py-2
                shadow-[0_1px_2px_rgba(15,23,42,0.04)]
              "
            >
              <div
                className="
                  flex h-6 w-6
                  items-center justify-center
                  rounded-lg
                  bg-slate-100
                "
              >
                <Icon
                  name="users"
                  size={13}
                  color="#475569"
                />
              </div>

              <div className="leading-none">
                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                  Total Loans
                </p>

                <p className="mt-1 text-[12px] font-bold text-slate-700">
                  {mainData?.total_loans?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Disbursed */}
            <div
              className="
                flex items-center gap-2
                rounded-2xl
                border border-blue-100
                bg-gradient-to-br from-blue-50 to-indigo-50/60
                px-3 py-2
                shadow-[0_1px_2px_rgba(15,23,42,0.04)]
              "
            >
              <div
                className="
                  flex h-6 w-6
                  items-center justify-center
                  rounded-lg
                  bg-white
                  shadow-sm
                "
              >
                <Icon
                  name="book"
                  size={13}
                  color="#1558bd"
                />
              </div>

              <div className="leading-none">
                <p className="text-[9px] font-bold uppercase tracking-wide text-blue-400">
                  Disbursed
                </p>

                <p className="mt-1 text-[12px] font-bold text-primary">
                  ₹
                  {mainData?.total_disbursed
                    ? Math.floor(
                        mainData.total_disbursed / 10000000,
                      ).toLocaleString()
                    : 0}
                  <span className="ml-1 text-[10px]">Cr</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          NAVIGATION / FILTER BAR
      ====================================================== */}
      <div
        className="
          sticky top-[68px] z-10
          border-b border-slate-200/70
          bg-white/70
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-white/60
        "
      >
        <div
          className="
            flex items-center
            gap-4
            px-4 sm:px-6
            py-3
          "
        >

          {/* -------------------------------------------------
              TABS
          -------------------------------------------------- */}
          <div
            className="
              min-w-0 flex-1
              overflow-x-auto
              no-scrollbar
            "
          >
            <div className="flex min-w-max items-center gap-1.5 rounded-2xl bg-slate-100/70 p-1">

              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      "group relative",
                      "flex items-center gap-2",
                      "min-h-[38px]",
                      "rounded-xl",
                      "px-3.5",
                      "text-[13px]",
                      "font-semibold",
                      "whitespace-nowrap",
                      "transition-all duration-200",
                      "cursor-pointer",

                      isActive
                        ? `
                          bg-white
                          text-primary
                          shadow-[0_4px_14px_-4px_rgba(21,88,189,0.35)]
                        `
                        : `
                          text-slate-500
                          hover:bg-white/60
                          hover:text-slate-800
                        `,
                    ].join(" ")}
                  >
                    <Icon
                      name={tab.icon}
                      size={16}
                      color={isActive ? "#1558bd" : "#64748b"}
                    />

                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* -------------------------------------------------
              PRODUCT FILTER
          -------------------------------------------------- */}
          <div
            className="
              hidden sm:block
              w-[210px]
              shrink-0
            "
          >
            <MultiCheckboxSelect
              label=""
              name="products"
              id="products"
              placeholder="All Products"
              options={productOptions}
              value={selectedProducts}
              onChange={(e) => {
                setSelectedProducts(e.target.value);
              }}
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
            onChange={(e) => {
              setSelectedProducts(e.target.value);
            }}
          />
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <main
        className="
          mx-auto
          w-full
          px-3 sm:px-5 lg:px-6
          py-6
        "
      >
        {page}
      </main>
    </div>
  );
};

export default Dashboard2;
