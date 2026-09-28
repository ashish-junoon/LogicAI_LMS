import React from "react";
import DisbursementsByStateChart from "./sectors/DisbursementsByState";
import NPABySectorChart from "./sectors/NPABySectorChart";
import SectorMonthlyLoanCountChart from "./sectors/SectorMonthlyLoanCount";
import HouseTypeSplitChart from "./sectors/HouseTypeSplitChart";

const SectorsGeography = ({ selectedProductsName }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DisbursementsByStateChart selectedProductsName={selectedProductsName} />
        <NPABySectorChart selectedProductsName={selectedProductsName} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectorMonthlyLoanCountChart selectedProductsName={selectedProductsName} />
        <HouseTypeSplitChart selectedProductsName={selectedProductsName} />
      </div>
    </div>
  );
};

export default SectorsGeography;