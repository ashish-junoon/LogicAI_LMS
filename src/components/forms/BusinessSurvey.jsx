import React, { useState } from "react";
import { RiStoreLine } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import TextInput from "../fields/TextInput";
import UploadInput from "../fields/UploadInput";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";

// Import your data arrays (you'll need to create these)
import {
  bussinesType,
  bussinessTrade,
  marketRelation,
  stockInAmount,
  bussinessVintage,
  loanAmountinLakh,
  //   stateList,
  districtList,
} from "../../content/data";
import ConfirmationModal from "../utils/ConfirmationModal";
import MarketSurveyForm from "./MarketSurveyForm";

const BusinessSurvey = ({ onNext, open, onToggle, step }) => {

  return (
    <>
      <Accordion
        title="Business Survey"
        subtitle="Business information and survey details"
        icon={RiStoreLine}
        onToggle={onToggle}
        open={open}
      >
        <MarketSurveyForm onNext={onNext} step={step} />
      </Accordion>
    </>
  );
};

export default BusinessSurvey;
