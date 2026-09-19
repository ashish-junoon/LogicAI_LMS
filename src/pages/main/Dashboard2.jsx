// import React, { useEffect, useMemo, useState } from "react";
// import Overview from "../../components/dashboard/Overview";
// import PortfolioHealth from "../../components/dashboard/PortfolioHealth";
// import SectorsGeography from "../../components/dashboard/SectorsGeography";
// import TeamPerformance from "../../components/dashboard/TeamPerformance";
// import CustomerProfile from "../../components/dashboard/CustomerProfile";
// import { Overview_MainAPI } from "../../api/functions";
// import { formatNumber } from "../../components/dashboard/Helper";
// import Collection from "../../components/dashboard/Collection";
// import Icon from "../../components/utils/Icon";
// import SelectInput from "../../components/fields/SelectInput";
// import MultiCheckboxSelect from "../../components/fields/MultiCheckboxSelect";

// const Dashboard2 = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [mainData, setMainData] = useState({});
//   const [selectedProducts, setSelectedProducts] = useState([]);  

//   const tabs = [
//     { id: "overview", label: "Overview" },
//     { id: "portfolio", label: "Portfolio Health" },
//     { id: "sectors", label: "Sectors & Geography" },
//     // { id: "team", label: "Team Performance" },
//     { id: "customers", label: "Customer Profile" },
//     { id: "collection", label: "Collection" },
//   ];

//   // const renderPage = () => {
//   //   switch (activeTab) {
//   //     case "overview":
//   //       return <Overview mainData={mainData} />;
//   //     case "portfolio":
//   //       return <PortfolioHealth />;
//   //     case "sectors":
//   //       return <SectorsGeography />;
//   //     case "team":
//   //       return <TeamPerformance />;
//   //     case "customers":
//   //       return <CustomerProfile />;
//   //     case "collection":
//   //       return <Collection />;
//   //     default:
//   //       return <Overview />;
//   //   }
//   // };

//   const page = useMemo(() => {
//   switch (activeTab) {
//     case "overview":
//       return <Overview mainData={mainData} />;

//     case "portfolio":
//       return <PortfolioHealth />;

//     case "sectors":
//       return <SectorsGeography />;

//     case "team":
//       return <TeamPerformance />;

//     case "customers":
//       return <CustomerProfile />;

//     case "collection":
//       return <Collection />;

//     default:
//       return <Overview mainData={mainData} />;
//   }
// }, [activeTab, mainData]);

//   const fetchOverview_Main = async () => {
//     try {
//       const req = {
//         from_date: "",
//         to_date: "",
//       };

//       const response = await Overview_MainAPI(req);
//       if (response.status) {
//         setMainData(response.data);
//       }
//     } catch (error) {
//       toast.error(error.message || "Something went wrong. Please try again.");
//     }
//   };

//   useEffect(() => {
//     fetchOverview_Main();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white/80 text-slate-800 text-sm">
//       <header className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
//         {/* Left */}
//         <div className="flex items-center gap-2.5">
//           <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
//             <Icon name="MdSpaceDashboard" size={18} color="white" />
//           </div>
//           <div className="leading-tight">
//             <h1 className="text-[15px] font-bold text-slate-700">
//               LMS Dashboard
//             </h1>
//             <p className="text-[9px] text-slate-400 font-medium mt-0.5">
//               Loan Management System
//             </p>
//           </div>
//         </div>

//         {/* Right */}
//         <div className="flex items-center gap-1.5 text-xs">
//           <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-50 border border-slate-200/50">
//             <Icon name="users" size={11} color="#64748b" />
//             <span className="font-medium text-slate-700">
//               {mainData?.total_loans?.toLocaleString() || 0} Loans
//             </span>
//           </div>
//           <div className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 border border-indigo-200/50">
//             <Icon name="book" size={11} color="#4f46e5" />
//             <span className="font-semibold text-primary">
//               ₹
//               {mainData?.total_disbursed
//                 ? Math.floor(mainData.total_disbursed / 10000).toLocaleString()
//                 : 0}
//             </span>
//             <span className="text-primary font-semibold">Cr</span>
//           </div>
//         </div>
//       </header>

//       <nav className="mx-auto px-4 py-3 border-b border-gray-200 shadow bg-white">
//         <div className="flex items-center justify-between gap-4">
//           {/* Tabs */}
//           <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
//             <div className="inline-flex min-w-max gap-2">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
//                     activeTab === tab.id
//                       ? "bg-primary text-white shadow"
//                       : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product */}
//           <div className="relative w-48 shrink-0">
//             <MultiCheckboxSelect
//               label=""
//               name="currentState"
//               id="currentState"
//               placeholder="Select product"
//               options={[
//                 { label: "PaisaUdhar", value: "PU" },
//                 { label: "EarlyWages", value: "EW" },
//                 { label: "Instapaise", value: "IP" },
//                 { label: "Refyne", value: "RF" },
//                 { label: "MSME", value: "MSME" },
//                 { label: "SME", value: "SME" },
//                 { label: "JLG", value: "JLG" },
//               ]}
//               value={selectedProducts}
//               onChange={(e) => {
//                 setSelectedProducts(e.target.value);
//               }}
//             />
//           </div>
//         </div>
//       </nav>

//       {/* Content */}
//       {/* <main className="px-2 sm:px-4 py-4 mx-auto">{renderPage()}</main> */}
//       <main className="px-2 sm:px-4 py-4 mx-auto">{page}</main>
//     </div>
//   );
// };

// export default Dashboard2;




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
      console.error(
        "Dashboard API Error:",
        error
      );
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
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800">

      {/* =====================================================
          TOP HEADER
      ====================================================== */}
      <header
        className="
          sticky top-0 z-20
          border-b border-slate-200/80
          bg-white/95
          backdrop-blur-md
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
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-[#edf4ff]
                text-primary
              "
            >
              <Icon
                name="MdSpaceDashboard"
                size={21}
                color="#1558bd"
              />
            </div>

            {/* Heading */}
            <div className="min-w-0 leading-tight">
              <h1
                className="
                  truncate
                  text-[16px]
                  font-bold
                  text-slate-800
                "
              >
                LMS Dashboard
              </h1>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-medium
                  tracking-wide
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
                rounded-xl
                border border-slate-200
                bg-slate-50/70
                px-3 py-2
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
                  name="users"
                  size={13}
                  color="#64748b"
                />
              </div>

              <div className="leading-none">
                <p className="text-[9px] font-medium text-slate-400">
                  TOTAL LOANS
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
                rounded-xl
                border border-blue-100
                bg-blue-50/70
                px-3 py-2
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
                <p className="text-[9px] font-medium text-blue-400">
                  DISBURSED
                </p>

                <p className="mt-1 text-[12px] font-bold text-primary">
                  ₹
                  {mainData?.total_disbursed
                    ? Math.floor(
                        mainData.total_disbursed /
                          10000000
                      ).toLocaleString()
                    : 0}
                  <span className="ml-1 text-[10px]">
                    Cr
                  </span>
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
          border-b border-slate-200/80
          bg-white/95
          backdrop-blur-md
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
            <div className="flex min-w-max items-center gap-1.5">

              {tabs.map((tab) => {
                const isActive =
                  activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    className={[
                      "group relative",
                      "flex items-center gap-2",
                      "min-h-[40px]",
                      "rounded-xl",
                      "px-3.5",
                      "text-[13px]",
                      "font-medium",
                      "whitespace-nowrap",
                      "transition-all duration-200",
                      "cursor-pointer",

                      isActive
                        ? `
                          bg-primary
                          text-white
                          shadow-[0_4px_12px_rgba(21,88,189,0.20)]
                        `
                        : `
                          text-slate-500
                          hover:bg-slate-50
                          hover:text-slate-800
                        `,
                    ].join(" ")}
                  >
                    <Icon
                      name={tab.icon}
                      size={16}
                      color={
                        isActive
                          ? "#ffffff"
                          : "#64748b"
                      }
                    />

                    <span>{tab.label}</span>

                    {/* Active bottom indicator */}
                    {isActive && (
                      <span
                        className="
                          absolute
                          bottom-0.5
                          left-1/2
                          h-0.5
                          w-5
                          -translate-x-1/2
                          rounded-full
                          bg-white/70
                        "
                      />
                    )}
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
                setSelectedProducts(
                  e.target.value
                );
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
              setSelectedProducts(
                e.target.value
              );
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
          py-5
        "
      >
        {page}
      </main>
    </div>
  );
};

export default Dashboard2;