import React, { useState } from "react";
import {
  RiMapPinLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiHome4Line,
  RiMapPinUserLine,
} from "react-icons/ri";

import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";
import ErrorMsg from "../utils/ErrorMsg";

import { useFormik } from "formik";
import * as Yup from "yup";

import { districtList, houseType, statesList } from "../../content/data";

const AddressInformation = ({ onNext, permission }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSameAsAadhaar, setIsSameAsAadhaar] = useState(false);

  const formik = useFormik({
    initialValues: {
      // Aadhaar Address - Read Only
      aadhaarAddress: "123 Main Street, Near Market",
      aadhaarPincode: "110001",
      aadhaarState: "Delhi",
      aadhaarDistrict: "New Delhi",
      aadhaarCity: "Delhi",
      aadhaarLocality: "Connaught Place",

      // Residential Address
      address: "456 Park Avenue",
      pincode: "110000",
      state: "Delhi",
      district: "New Delhi",
      city: "Delhi",
      locality: "Rajendra Place",
      landmark: "Near Metro Station",
      residenceType: "Owned",
      yearsAtAddress: "5",
    },

    validationSchema: Yup.object({
      address: Yup.string().required("Address is required"),

      pincode: Yup.string()
        .matches(/^[1-9][0-9]{5}$/, "Enter a valid pincode")
        .required("Pincode is required"),

      state: Yup.string().required("State is required"),

      district: Yup.string().required("District is required"),

      city: Yup.string().required("City is required"),

      locality: Yup.string().required("Locality is required"),
    }),

    onSubmit: async (values) => {
      const finalValues = {
        ...values,
        sameAsAadhaar: isSameAsAadhaar,
      };

      console.log("Address Values:", finalValues);

      // API call here

      setIsEditing(false);

      onNext?.();
    },
  });

  /* =========================================================
     EDIT
  ========================================================== */

  const handleEdit = () => {
    setIsEditing(true);
  };

  /* =========================================================
     CANCEL
  ========================================================== */

  const handleCancel = () => {
    formik.resetForm();
    setIsSameAsAadhaar(false);
    setIsEditing(false);
  };

  /* =========================================================
     SAME AS AADHAAR
  ========================================================== */

  const handleSameAsAadhaar = (e) => {
    const checked = e.target.checked;

    setIsSameAsAadhaar(checked);

    if (checked) {
      formik.setValues({
        ...formik.values,

        address: formik.values.aadhaarAddress,
        pincode: formik.values.aadhaarPincode,
        state: formik.values.aadhaarState,
        district: formik.values.aadhaarDistrict,
        city: formik.values.aadhaarCity,
        locality: formik.values.aadhaarLocality,

        // Optional fields
        landmark: "",
        residenceType: "",
        yearsAtAddress: "",
      });
    }
  };

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-slate-200
            bg-gradient-to-r
          from-primary/10
          via-white
          to-white
          px-4
          py-3
        "
      >
        {/* LEFT */}

        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-primary/10
              text-primary
            "
          >
            <RiMapPinLine size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Address Information
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Customer residential address
            </p>
          </div>
        </div>

        {/* EDIT */}

        {permission && !isEditing && (
          <Button
            type="button"
            onClick={handleEdit}
            btnName={
              <span className="flex items-center gap-1.5">
                <RiEditLine size={14} />
                Edit Address
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
              hover:border-primary
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
          {/* =================================================
              AADHAAR ADDRESS
          ================================================== */}

          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  bg-slate-100
                  text-slate-600
                "
              >
                <RiMapPinUserLine size={15} />
              </div>

              <div>
                <h4 className="text-[13px] font-semibold text-slate-700">
                  Aadhaar Address
                </h4>

                <p className="text-[10px] text-slate-400">
                  Address as per Aadhaar
                </p>
              </div>

              <span
                className="
                  rounded-full
                  bg-slate-100
                  px-2
                  py-0.5
                  text-[9px]
                  font-medium
                  text-slate-500
                "
              >
                READ ONLY
              </span>
            </div>

            <div
              className="
                grid
                grid-cols-4
                gap-x-4
                gap-y-3
                max-xl:grid-cols-2
                max-sm:grid-cols-1
              "
            >
              <div className="col-span-2 max-xl:col-span-2 max-sm:col-span-1">
                <TextInput
                  label="Aadhaar Address"
                  name="aadhaarAddress"
                  value={formik.values.aadhaarAddress}
                  readOnly
                  style="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div>
                <TextInput
                  label="Pincode"
                  name="aadhaarPincode"
                  value={formik.values.aadhaarPincode}
                  readOnly
                  style="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div>
                <TextInput
                  label="State"
                  name="aadhaarState"
                  value={formik.values.aadhaarState}
                  readOnly
                  style="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div>
                <TextInput
                  label="District"
                  name="aadhaarDistrict"
                  value={formik.values.aadhaarDistrict}
                  readOnly
                  style="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div>
                <TextInput
                  label="City"
                  name="aadhaarCity"
                  value={formik.values.aadhaarCity}
                  readOnly
                  style="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div>
                <TextInput
                  label="Locality"
                  name="aadhaarLocality"
                  value={formik.values.aadhaarLocality}
                  readOnly
                  style="bg-slate-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              DIVIDER
          ================================================== */}

          <div className="my-5 border-t border-dashed border-slate-200" />

          {/* =================================================
              RESIDENTIAL ADDRESS
          ================================================== */}

          <div>
            {/* TITLE + SAME AS AADHAAR */}

            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-md
                    bg-blue-50
                    text-primary
                  "
                >
                  <RiHome4Line size={15} />
                </div>

                <div>
                  <h4 className="text-[13px] font-semibold text-slate-700">
                    Residential Address
                  </h4>

                  <p className="text-[10px] text-slate-400">
                    Customer's current residential address
                  </p>
                </div>
              </div>

              {/* SAME AS AADHAAR */}

              {isEditing && (
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-primary/20
                    bg-primary/5
                    px-3
                    py-2
                    transition
                    hover:bg-primary/10
                  "
                >
                  <input
                    type="checkbox"
                    checked={isSameAsAadhaar}
                    onChange={handleSameAsAadhaar}
                    className="
                      h-4
                      w-4
                      rounded
                      border-slate-300
                      text-primary
                      focus:ring-primary
                    "
                  />

                  <span className="text-[11px] font-medium text-slate-600">
                    Same as Aadhaar Address
                  </span>
                </label>
              )}
            </div>

            {/* ADDRESS FIELDS */}

            <div
              className="
                grid
                grid-cols-4
                gap-x-4
                gap-y-3
                max-xl:grid-cols-2
                max-sm:grid-cols-1
              "
            >
              {/* Address */}

              <div className="col-span-4 max-xl:col-span-2 max-sm:col-span-1">
                <TextInput
                  label="Residential Address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing || isSameAsAadhaar}
                />

                <ErrorMsg
                  error={formik.touched.address && formik.errors.address}
                />
              </div>

              {/* Pincode */}

              <div>
                <TextInput
                  label="Pincode"
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={6}
                  disabled={!isEditing || isSameAsAadhaar}
                />

                <ErrorMsg
                  error={formik.touched.pincode && formik.errors.pincode}
                />
              </div>

              {/* State */}

              <div>
                <SelectInput
                  label="State"
                  name="state"
                  placeholder="Select State"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={statesList}
                  disabled={!isEditing || isSameAsAadhaar}
                />

                <ErrorMsg error={formik.touched.state && formik.errors.state} />
              </div>

              {/* District */}

              <div>
                <SelectInput
                  label="District"
                  name="district"
                  placeholder="Select District"
                  value={formik.values.district}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={districtList}
                  disabled={!isEditing || isSameAsAadhaar}
                />

                <ErrorMsg
                  error={formik.touched.district && formik.errors.district}
                />
              </div>

              {/* City */}

              <div>
                <TextInput
                  label="City"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing || isSameAsAadhaar}
                />

                <ErrorMsg error={formik.touched.city && formik.errors.city} />
              </div>

              {/* Locality */}

              <div>
                <TextInput
                  label="Locality"
                  name="locality"
                  value={formik.values.locality}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing || isSameAsAadhaar}
                />

                <ErrorMsg
                  error={formik.touched.locality && formik.errors.locality}
                />
              </div>

              {/* Landmark */}

              <div>
                <TextInput
                  label="Landmark"
                  name="landmark"
                  value={formik.values.landmark}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                />
              </div>

              {/* Residence Type */}

              <div>
                <SelectInput
                  label="Residence Type"
                  name="residenceType"
                  placeholder="Select Residence Type"
                  value={formik.values.residenceType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={houseType}
                  disabled={!isEditing}
                />
              </div>

              {/* Years */}

              <div>
                <SelectInput
                  label="Years at Address"
                  name="yearsAtAddress"
                  value={formik.values.yearsAtAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Select Years"
                  options={Array.from({ length: 20 }, (_, i) => ({
                    label: String(i + 1),
                    value: String(i + 1),
                  }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================== */}

          {permission && isEditing && (
            <div
              className="
                mt-6
                flex
                items-center
                justify-end
                gap-2
                border-t
                border-slate-100
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
                btnName={
                  <span className="flex items-center gap-1.5">
                    <RiCheckLine size={16} />
                    Save & Continue
                  </span>
                }
                style="
                  !w-auto
                  px-4
                  py-2
                  bg-primary
                  text-white
                  hover:bg-primary
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

export default AddressInformation;
