import React from "react";
import { RiMapPinLine } from "react-icons/ri";
import Accordion from "../utils/Accordion";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";
import ErrorMsg from "../utils/ErrorMsg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { districtList, houseType, statesList } from "../../content/data";

const AddressInfo = ({onNext,open, onToggle}) => {
  const formik = useFormik({
    initialValues: {
      address: "",
      pincode: "",
      state: "",
      district: "",
      city: "",
      locality: "",
      landmark: "",
      residenceType: "",
      yearsAtAddress: "",
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

      landmark: Yup.string(),

      residenceType: Yup.string().required("Residence type is required"),

      yearsAtAddress: Yup.number()
        .typeError("Enter a valid number")
        .positive("Must be positive")
        .required("Years at current address is required"),
    }),

    onSubmit: (values) => {
      console.log(values);
      onNext();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Address Information"
        subtitle="Customer residential address"
        icon={RiMapPinLine}
        onToggle={onToggle}
        open={open}
      >
        <div className="grid max-md:grid-cols-2 grid-cols-3 gap-4">
          {/* Address */}
          <div className="max-md:col-span-2 col-span-3">
            <TextInput
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <ErrorMsg error={formik.touched.address && formik.errors.address} />
          </div>

          {/* Pincode */}
          <div>
            <TextInput
              label="Pincode"
              name="pincode"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <ErrorMsg error={formik.touched.pincode && formik.errors.pincode} />
          </div>

          {/* State */}
          <div>
            <SelectInput
              label="State"
              name="state"
              placeholder="Select State type"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={statesList}
            />
            <ErrorMsg error={formik.touched.state && formik.errors.state} />
          </div>

          {/* District */}
          <div>
            <SelectInput
              label="District"
              name="district"
              placeholder="Select District type"
              value={formik.values.district}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={districtList}
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
            />
            <ErrorMsg error={formik.touched.city && formik.errors.city} />
          </div>

          {/* Locality */}
          <div>
            <TextInput
              label="Locality / Area"
              name="locality"
              value={formik.values.locality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
            />
            <ErrorMsg
              error={formik.touched.landmark && formik.errors.landmark}
            />
          </div>

          {/* Residence Type */}
          <div>
            <SelectInput
              label="Residence Type"
              placeholder="Select Resident type"
              name="residenceType"
              value={formik.values.residenceType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={houseType}
            />
            <ErrorMsg
              error={
                formik.touched.residenceType && formik.errors.residenceType
              }
            />
          </div>

          {/* Years at Current Address */}
          <div>
            <TextInput
              label="Years at Current Address"
              name="yearsAtAddress"
              value={formik.values.yearsAtAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <ErrorMsg
              error={
                formik.touched.yearsAtAddress && formik.errors.yearsAtAddress
              }
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            btnName="Save & Continue"
            style="bg-blue-600 hover:bg-blue-700 text-white"
          />
        </div>
      </Accordion>
    </form>
  );
};

export default AddressInfo;
