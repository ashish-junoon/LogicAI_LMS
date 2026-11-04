import { useFormik } from "formik";
import {
  RiUser3Line,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "../utils/Button";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";
import ErrorMsg from "../utils/ErrorMsg";

import { SaveApplicantDetails } from "../../api/application";
import { GetAllCastes, GetAllReligions } from "../../api/mastersApi";
import { useAuthData } from "../../context/authContext";

const personalFields = [
  { name: "full_name", label: "Customer Name" },
  { name: "father_name", label: "Father Name" },
  { name: "dob", label: "Date of Birth", type: "date" },
  { name: "gender", label: "Gender" },
  { name: "marital_status", label: "Marital Status" },
  { name: "alternate_mobile", label: "Alternate Mobile" },
  { name: "email_id", label: "Email Address", type: "email" },
  { name: "primary_document_type", label: "Primary Document Type" },
  { name: "uid_number", label: "Aadhaar Number" },
  { name: "father_dob", label: "Father Date of Birth", type: "date" },
  { name: "father_age", label: "Father Age", type: "number" },
  { name: "mother_name", label: "Mother Name" },
  { name: "mother_dob", label: "Mother Date of Birth", type: "date" },
  { name: "mother_age", label: "Mother Age", type: "number" },
  { name: "religion", label: "Religion", type: "select" },
  { name: "caste_category", label: "Caste Category", type: "select" },
  { name: "whatsapp_no", label: "WhatsApp Number" },
];

const personalInformationValues = (personalKyc = {}) =>
  Object.fromEntries(
    personalFields.map(({ name }) => [name, personalKyc[name] ?? ""]),
  );

const PersonalInformation = ({
  permission,
  marketSurvey,
  personalKyc,
  addressDetails,
  documents = [],
  onSaved,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [religions, setReligions] = useState([]);
  const [castes, setCastes] = useState([]);
  const { authData } = useAuthData();

  

  useEffect(() => {
    let cancelled = false;

    const fetchMasters = async () => {
      try {
        const [religionsResponse, castesResponse] = await Promise.all([
          GetAllReligions(),
          GetAllCastes(),
        ]);

        if (cancelled) return;

        setReligions(
          (religionsResponse?.data || [])
            .filter((item) => item?.is_active !== false)
            .map((item) => ({
              value: String(item.id),
              label: item.religion,
            })),
        );
        setCastes(
          (castesResponse?.data || [])
            .filter((item) => item?.is_active !== false)
            .map((item) => ({
              value: String(item.id),
              label: item.caste_name,
            })),
        );
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching religion and caste masters:", error);
          toast.error("Unable to load religion and caste options.");
        }
      }
    };

    fetchMasters();
    return () => {
      cancelled = true;
    };
  }, []);

  const formik = useFormik({
    initialValues: personalInformationValues(personalKyc),

    enableReinitialize: true,

    onSubmit: async (values) => {
      const customerId =
        personalKyc?.customer_id || addressDetails?.customer_id || marketSurvey?.customer_id;
      const applicationId =
        personalKyc?.application_id || addressDetails?.application_id || marketSurvey?.application_id;

      if (!customerId || !applicationId) {
        toast.error("Customer ID and application ID are required to save personal details.");
        return;
      }

      const updatedBy = authData?.full_name || personalKyc?.updated_by || "admin";
      const toNumber = (value) => Number(value || 0);
      const request = {
        application_id: applicationId,
        customer_id: customerId,
        personal_kyc: [
          {
            full_name: values.full_name.trim(),
            father_name: values.father_name.trim(),
            dob: values.dob,
            gender: values.gender,
            marital_status: values.marital_status,
            alternate_mobile: values.alternate_mobile.trim(),
            email_id: values.email_id.trim(),
            primary_document_type: values.primary_document_type.toUpperCase(),
            uid_number: values.uid_number.trim(),
            father_dob: values.father_dob,
            father_age: toNumber(values.father_age),
            spouse_name: "",
            spouse_dob: "",
            spouse_age: 0,
            mother_name: values.mother_name.trim(),
            mother_dob: values.mother_dob,
            mother_age: toNumber(values.mother_age),
            religion: toNumber(values.religion),
            caste_category: toNumber(values.caste_category),
            whatsapp_no: values.whatsapp_no.trim(),
          },
        ],
        address: [
          {
            permanent_address: addressDetails?.permanent_address || "",
            permanent_city: addressDetails?.permanent_city || "",
            permanent_state: addressDetails?.permanent_state || "",
            permanent_pin_code: addressDetails?.permanent_pin_code || "",
            current_address: addressDetails?.current_address || "",
            current_city: addressDetails?.current_city || "",
            current_state: addressDetails?.current_state || "",
            current_pin_code: addressDetails?.current_pin_code || "",
            years_at_residence: addressDetails?.years_at_residence || "",
            years_at_city: addressDetails?.years_at_city || "",
            years_at_state: addressDetails?.years_at_state || "",
            ownership: addressDetails?.ownership || "",
            room_count: toNumber(addressDetails?.room_count),
            type_of_house: addressDetails?.type_of_house || "",
            residence_area_quality: addressDetails?.residence_area_quality || "",
          },
        ],
        documents: documents
          .filter((document) => document?.document_base64)
          .map((document) => ({
            document_type: document.document_type || "",
            document_base64: document.document_base64,
            file_extension: document.file_extension || "",
          })),
        created_by: authData?.user_id,
        updated_by: authData?.user_id,
        company_id:
          personalKyc?.company_id || marketSurvey?.company_id || import.meta.env.VITE_COMPANY_ID || "",
        product_name:
          personalKyc?.product_name || marketSurvey?.product_name || import.meta.env.VITE_PRODUCT_NAME || "",
        persoanl_kyc_is_completed: true,
        address_is_completed: true,
        is_applicant_verified: true,
      };

      try {
        const response = await SaveApplicantDetails(request);

        if (!response?.status) {
          toast.error(response?.message || "Unable to save personal details.");
          return;
        }

        formik.resetForm({ values });
        setIsEditing(false);
        toast.success(response?.message || "Personal details saved successfully.");
        await onSaved?.();
      } catch (error) {
        console.error("Error saving personal KYC details:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message ||
            "Something went wrong while saving personal details.",
        );
      }
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          flex items-center justify-between
          border-b border-slate-200
          bg-linear-to-r from-primary/10 via-white to-white
          px-4 py-3
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-lg
              border border-primary/10
              bg-primary/10
            "
          >
            <RiUser3Line className="text-xl text-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Customer Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Basic customer details
            </p>
          </div>
        </div>

        {/* RIGHT */}
        {permission && !isEditing && (
          <Button
            type="button"
            onClick={handleEdit}
            btnName={
              <span className="flex items-center gap-1.5">
                <RiEditLine size={15} />
                Edit
              </span>
            }
            style="
              !w-auto
              px-3
              py-1.5
              bg-white
              border
              border-primary
              text-primary
              hover:bg-primary
              hover:text-white
              text-xs
              font-medium
              rounded-lg
            "
          />
        )}
      </div>

      {/* =====================================================
          FORM
      ====================================================== */}
      <form onSubmit={formik.handleSubmit}>
        <div className="p-4">
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-x-4
              gap-y-3
            "
          >
            {personalFields.map((field) => (
              <div key={field.name}>
                {field.type === "date" ? (
                  <DateInput
                    label={field.label}
                    name={field.name}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                  />
                ) : field.type === "select" ? (
                  <SelectInput
                    label={field.label}
                    name={field.name}
                    options={field.name === "religion" ? religions : castes}
                    placeholder={`Select ${field.label}`}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                  />
                ) : (
                  <TextInput
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                  />
                )}
                <ErrorMsg
                  error={formik.touched[field.name] && formik.errors[field.name]}
                />
              </div>
            ))}
          </div>

          {/* =================================================
              EDIT ACTIONS
          ================================================== */}
          {permission && isEditing && (
            <div
              className="
                mt-5
                flex items-center justify-end gap-2
                border-t border-slate-100
                pt-4
              "
            >
              <Button
                type="button"
                onClick={handleCancel}
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCloseLine size={16} />
                    Cancel
                  </span>
                }
                style="
                  !w-auto
                  px-4
                  py-2
                  bg-white
                  border
                  border-slate-300
                  text-slate-600
                  hover:bg-slate-50
                  text-xs
                  font-medium
                  rounded-lg
                "
              />

              <Button
                type="submit"
                disabled={formik.isSubmitting}
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCheckLine size={16} />
                    Save Changes
                  </span>
                }
                style="
                  !w-auto
                  px-4
                  py-2
                  bg-primary
                  hover:bg-primary
                  text-white
                  text-xs
                  font-medium
                  rounded-lg
                "
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default PersonalInformation;
