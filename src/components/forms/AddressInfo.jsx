import React, { useState } from "react";
import { RiMapPinLine } from "react-icons/ri";
import Accordion from "../utils/Accordion";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";
import ErrorMsg from "../utils/ErrorMsg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { districtList, houseType, statesList } from "../../content/data";

const AddressInfo = ({ onNext, open, onToggle, step, permission }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSameAsCurrent, setIsSameAsCurrent] = useState(false);

  const formik = useFormik({
    initialValues: {
      // Aadhaar Address (readonly)
      aadhaarAddress: "123 Main Street, Near Market",
      aadhaarPincode: "110001",
      aadhaarState: "Delhi",
      aadhaarDistrict: "New Delhi",
      aadhaarCity: "Delhi",
      aadhaarLocality: "Connaught Place",

      // Current Address
      currentAddress: "456 Park Avenue",
      currentPincode: "1100",
      currentState: "Delhi",
      currentDistrict: "New Delhi",
      currentCity: "Delhi",
      currentLocality: "Rajendra Place",
      currentLandmark: "Near Metro Station",
      currentResidenceType: "Owned",
      currentYearsAtAddress: "5",

      // Permanent Address
      permanentAddress: "789 Green Valley",
      permanentPincode: "110003",
      permanentState: "Delhi",
      permanentDistrict: "New Delhi",
      permanentCity: "Delhi",
      permanentLocality: "Vasant Vihar",
      permanentLandmark: "Near Park",
      permanentResidenceType: "Rented",
      permanentYearsAtAddress: "3",
    },

    validationSchema: Yup.object({
      // Aadhaar Address validations (if needed)
      // aadhaarAddress: Yup.string().required("Aadhaar Address is required"),
      // aadhaarPincode: Yup.string()
      //   .matches(/^[1-9][0-9]{5}$/, "Enter a valid pincode")
      //   .required("Aadhaar Pincode is required"),
      // aadhaarState: Yup.string().required("Aadhaar State is required"),
      // aadhaarDistrict: Yup.string().required("Aadhaar District is required"),
      // aadhaarCity: Yup.string().required("Aadhaar City is required"),
      // aadhaarLocality: Yup.string().required("Aadhaar Locality is required"),

      // Current Address validations
      // currentAddress: Yup.string().required("Current Address is required"),
      // currentPincode: Yup.string()
      //   .matches(/^[1-9][0-9]{5}$/, "Enter a valid pincode")
      //   .required("Current Pincode is required"),
      // currentState: Yup.string().required("Current State is required"),
      // currentDistrict: Yup.string().required("Current District is required"),
      // currentCity: Yup.string().required("Current City is required"),
      // currentLocality: Yup.string().required("Current Locality is required"),
      // currentLandmark: Yup.string(),
      // currentResidenceType: Yup.string().required(
      //   "Current Residence type is required",
      // ),
      // currentYearsAtAddress: Yup.number()
      //   .typeError("Enter a valid number")
      //   .positive("Must be positive")
      //   .required("Years at current address is required"),

      // Permanent Address validations (optional if same as current)
      permanentAddress: Yup.string().when("isSameAsCurrent", {
        is: false,
        then: (schema) => schema.required("Permanent Address is required"),
      }),
      permanentPincode: Yup.string().when("isSameAsCurrent", {
        is: false,
        then: (schema) =>
          schema
            .matches(/^[1-9][0-9]{5}$/, "Enter a valid pincode")
            .required("Permanent Pincode is required"),
      }),
      permanentState: Yup.string().when("isSameAsCurrent", {
        is: false,
        then: (schema) => schema.required("Permanent State is required"),
      }),
      permanentDistrict: Yup.string().when("isSameAsCurrent", {
        is: false,
        then: (schema) => schema.required("Permanent District is required"),
      }),
      permanentCity: Yup.string().when("isSameAsCurrent", {
        is: false,
        then: (schema) => schema.required("Permanent City is required"),
      }),
      permanentLocality: Yup.string().when("isSameAsCurrent", {
        is: false,
        then: (schema) => schema.required("Permanent Locality is required"),
      }),
    }),

    onSubmit: (values) => {
      // If same as current, copy current values to permanent
      if (isSameAsCurrent) {
        values.permanentAddress = values.currentAddress;
        values.permanentPincode = values.currentPincode;
        values.permanentState = values.currentState;
        values.permanentDistrict = values.currentDistrict;
        values.permanentCity = values.currentCity;
        values.permanentLocality = values.currentLocality;
        values.permanentLandmark = values.currentLandmark;
        values.permanentResidenceType = values.currentResidenceType;
        values.permanentYearsAtAddress = values.currentYearsAtAddress;
      }

      console.log(values);
            onNext();
setIsEditing(false);
    },
  });

  // Handle "Same as Current Address" checkbox
  const handleSameAsCurrent = (e) => {
    const checked = e.target.checked;
    setIsSameAsCurrent(checked);

    if (checked) {
      // Copy current address values to permanent address
      formik.setFieldValue("permanentAddress", formik.values.currentAddress);
      formik.setFieldValue("permanentPincode", formik.values.currentPincode);
      formik.setFieldValue("permanentState", formik.values.currentState);
      formik.setFieldValue("permanentDistrict", formik.values.currentDistrict);
      formik.setFieldValue("permanentCity", formik.values.currentCity);
      formik.setFieldValue("permanentLocality", formik.values.currentLocality);
      formik.setFieldValue("permanentLandmark", formik.values.currentLandmark);
      formik.setFieldValue(
        "permanentResidenceType",
        formik.values.currentResidenceType,
      );
      formik.setFieldValue(
        "permanentYearsAtAddress",
        formik.values.currentYearsAtAddress,
      );
    }
  };

  // Update permanent fields when current fields change (if checkbox is checked)
  const handleCurrentFieldChange = (e) => {
    const { name, value } = e.target;
    formik.handleChange(e);

    if (isSameAsCurrent) {
      const permanentFieldName = name.replace("current", "permanent");
      formik.setFieldValue(permanentFieldName, value);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Address Information"
        subtitle="Customer residential address"
        icon={RiMapPinLine}
        onToggle={onToggle}
        open={open}
      >
        {/* Aadhaar Address Section (Readonly) */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Aadhaar Address
          </h3>
          <div className="grid max-md:grid-cols-2 grid-cols-4 gap-2">
            <div className="max-md:col-span-2 col-span-3">
              <TextInput
                label="Aadhaar Address"
                name="aadhaarAddress"
                value={formik.values.aadhaarAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
                style="bg-gray-200 cursor-not-allowed"
              />
              <ErrorMsg
                error={
                  formik.touched.aadhaarAddress && formik.errors.aadhaarAddress
                }
              />
            </div>
            <div>
              <TextInput
                label="Aadhaar Pincode"
                name="aadhaarPincode"
                value={formik.values.aadhaarPincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
                style="bg-gray-200 cursor-not-allowed"
              />
              <ErrorMsg
                error={
                  formik.touched.aadhaarPincode && formik.errors.aadhaarPincode
                }
              />
            </div>
            <div>
              <TextInput
                label="Aadhaar State"
                name="aadhaarState"
                placeholder="Select State"
                value={formik.values.aadhaarState}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
                style="bg-gray-200 cursor-not-allowed"
              />
              <ErrorMsg
                error={
                  formik.touched.aadhaarState && formik.errors.aadhaarState
                }
              />
            </div>
            <div>
              <TextInput
                label="Aadhaar District"
                name="aadhaarDistrict"
                placeholder="Select District"
                value={formik.values.aadhaarDistrict}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // options={districtList}
                readOnly
                style="bg-gray-200 cursor-not-allowed"
              />
              <ErrorMsg
                error={
                  formik.touched.aadhaarDistrict &&
                  formik.errors.aadhaarDistrict
                }
              />
            </div>
            <div>
              <TextInput
                label="Aadhaar City"
                name="aadhaarCity"
                value={formik.values.aadhaarCity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
                style="bg-gray-200 cursor-not-allowed"
              />
              <ErrorMsg
                error={formik.touched.aadhaarCity && formik.errors.aadhaarCity}
              />
            </div>
            <div>
              <TextInput
                label="Aadhaar Locality"
                name="aadhaarLocality"
                value={formik.values.aadhaarLocality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
                style="bg-gray-200 cursor-not-allowed"
              />
              <ErrorMsg
                error={
                  formik.touched.aadhaarLocality &&
                  formik.errors.aadhaarLocality
                }
              />
            </div>
          </div>
        </div>

        {/* Current Address Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Current Address
          </h3>
          <div className="grid max-md:grid-cols-2 grid-cols-4 gap-2">
            <div className="max-md:col-span-2 col-span-4">
              <TextInput
                label="Current Address"
                name="currentAddress"
                value={formik.values.currentAddress}
                onChange={handleCurrentFieldChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.currentAddress && formik.errors.currentAddress
                }
              />
            </div>
            <div>
              <TextInput
                label="Current Pincode"
                name="currentPincode"
                value={formik.values.currentPincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
                maxLength={6}
              />
              <ErrorMsg
                error={
                  formik.touched.currentPincode && formik.errors.currentPincode
                }
              />
            </div>
            <div>
              <SelectInput
                label="Current State"
                name="currentState"
                placeholder="Select State"
                value={formik.values.currentState}
                onChange={handleCurrentFieldChange}
                onBlur={formik.handleBlur}
                options={statesList}
                disabled={!isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.currentState && formik.errors.currentState
                }
              />
            </div>
            <div>
              <SelectInput
                label="Current District"
                name="currentDistrict"
                placeholder="Select District"
                value={formik.values.currentDistrict}
                onChange={handleCurrentFieldChange}
                onBlur={formik.handleBlur}
                options={districtList}
                disabled={!isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.currentDistrict &&
                  formik.errors.currentDistrict
                }
              />
            </div>
            <div>
              <TextInput
                label="Current City"
                name="currentCity"
                value={formik.values.currentCity}
                onChange={handleCurrentFieldChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />
              <ErrorMsg
                error={formik.touched.currentCity && formik.errors.currentCity}
              />
            </div>
            <div>
              <TextInput
                label="Current Locality"
                name="currentLocality"
                value={formik.values.currentLocality}
                onChange={handleCurrentFieldChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.currentLocality &&
                  formik.errors.currentLocality
                }
              />
            </div>
            <div>
              <TextInput
                label="Current Landmark"
                name="currentLandmark"
                value={formik.values.currentLandmark}
                onChange={handleCurrentFieldChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.currentLandmark &&
                  formik.errors.currentLandmark
                }
              />
            </div>
            <div>
              <SelectInput
                label="Current Residence Type"
                placeholder="Select Residence type"
                name="currentResidenceType"
                value={formik.values.currentResidenceType}
                onChange={handleCurrentFieldChange}
                onBlur={formik.handleBlur}
                options={houseType}
                disabled={!isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.currentResidenceType &&
                  formik.errors.currentResidenceType
                }
              />
            </div>

            <div>
              <SelectInput
                label="Years at Current Address"
                name="currentYearsAtAddress"
                value={formik.values.currentYearsAtAddress}
                onChange={handleCurrentFieldChange}
                onBlur={formik.handleBlur}
                placeholder={"Years at Current Address"}
                options={Array.from({ length: 20 }, (_, i) => ({
                  label: String(i + 1),
                  value: String(i + 1),
                }))}
                disabled={!isEditing}
              />
              <ErrorMsg
                error={
                  formik.touched.currentYearsAtAddress &&
                  formik.errors.currentYearsAtAddress
                }
              />
            </div>
          </div>
        </div>

        {/* Permanent Address Section */}
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mr-4">
              Permanent Address
            </h3>
            {isEditing && <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSameAsCurrent}
                onChange={handleSameAsCurrent}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                disabled={!isEditing}
              />
              <span className="text-sm text-gray-600">
                Same as Current Address
              </span>
            </label>}
          </div>

          <div className="grid max-md:grid-cols-2 grid-cols-4 gap-2">
            <div className="max-md:col-span-2 col-span-4">
              <TextInput
                label="Permanent Address"
                name="permanentAddress"
                value={formik.values.permanentAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsCurrent || (!isEditing)}
                className={isSameAsCurrent ? "bg-gray-100" : ""}
              />
              <ErrorMsg
                error={
                  formik.touched.permanentAddress &&
                  formik.errors.permanentAddress
                }
              />
            </div>
            <div>
              <TextInput
                label="Permanent Pincode"
                name="permanentPincode"
                value={formik.values.permanentPincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsCurrent || (!isEditing)}
                className={isSameAsCurrent ? "bg-gray-100" : ""}
              />
              <ErrorMsg
                error={
                  formik.touched.permanentPincode &&
                  formik.errors.permanentPincode
                }
              />
            </div>
            <div>
              <SelectInput
                label="Permanent State"
                name="permanentState"
                placeholder="Select State"
                value={formik.values.permanentState}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={statesList}
                disabled={isSameAsCurrent || (!isEditing)}
                className={isSameAsCurrent ? "bg-gray-100" : ""}
              />
              <ErrorMsg
                error={
                  formik.touched.permanentState && formik.errors.permanentState
                }
              />
            </div>
            <div>
              <SelectInput
                label="Permanent District"
                name="permanentDistrict"
                placeholder="Select District"
                value={formik.values.permanentDistrict}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={districtList}
                disabled={isSameAsCurrent || (!isEditing)}
                className={isSameAsCurrent ? "bg-gray-100" : ""}
              />
              <ErrorMsg
                error={
                  formik.touched.permanentDistrict &&
                  formik.errors.permanentDistrict
                }
              />
            </div>
            <div>
              <TextInput
                label="Permanent City"
                name="permanentCity"
                value={formik.values.permanentCity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsCurrent || (!isEditing)}
                className={isSameAsCurrent ? "bg-gray-100" : ""}
              />
              <ErrorMsg
                error={
                  formik.touched.permanentCity && formik.errors.permanentCity
                }
              />
            </div>
            <div>
              <TextInput
                label="Permanent Locality"
                name="permanentLocality"
                value={formik.values.permanentLocality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsCurrent || (!isEditing)}
                className={isSameAsCurrent ? "bg-gray-100" : ""}
              />
              <ErrorMsg
                error={
                  formik.touched.permanentLocality &&
                  formik.errors.permanentLocality
                }
              />
            </div>
            <div>
              <TextInput
                label="Permanent Landmark"
                name="permanentLandmark"
                value={formik.values.permanentLandmark}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsCurrent || (!isEditing)}
                className={isSameAsCurrent ? "bg-gray-100" : ""}
              />
              <ErrorMsg
                error={
                  formik.touched.permanentLandmark &&
                  formik.errors.permanentLandmark
                }
              />
            </div>
            <div>
              <SelectInput
                label="Permanent Residence Type"
                placeholder="Select Residence type"
                name="permanentResidenceType"
                value={formik.values.permanentResidenceType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={houseType}
                disabled={isSameAsCurrent || (!isEditing)}
                className={isSameAsCurrent ? "bg-gray-100" : ""}
              />
              <ErrorMsg
                error={
                  formik.touched.permanentResidenceType &&
                  formik.errors.permanentResidenceType
                }
              />
            </div>
            <div>
              <SelectInput
                label="Years at Permanent Address"
                placeholder={"Years at Permanent Address"}
                name="permanentYearsAtAddress"
                value={formik.values.permanentYearsAtAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsCurrent || (!isEditing)}
                className={isSameAsCurrent ? "bg-gray-100" : ""}
                options={Array.from({ length: 20 }, (_, i) => ({
                  label: String(i + 1),
                  value: String(i + 1),
                }))}
              />
              <ErrorMsg
                error={
                  formik.touched.permanentYearsAtAddress &&
                  formik.errors.permanentYearsAtAddress
                }
              />
            </div>

          </div>
        </div>

        {permission && <div className="flex justify-end mt-6 gap-3">
          {!isEditing &&
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              btnName={"Edit"}
              style="bg-primary hover:bg-primary text-white w-full sm:w-auto text-sm"
            />
          }
            {isEditing &&
            <>
            <Button
              type="button"
              btnName="Cancel"
              onClick={()=> setIsEditing(false)}
              style="bg-primary hover:bg-primary text-white text-sm"
            />
            <Button
              type="submit"
              btnName="Save & Continue"
              style="bg-primary hover:bg-primary text-white text-sm"
            />
            </>}
        </div>}
      </Accordion>
    </form>
  );
};

export default AddressInfo;
