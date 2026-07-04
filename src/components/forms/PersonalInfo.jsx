import { useFormik } from "formik";
import * as Yup from "yup";
import { RiUser3Line } from "react-icons/ri";

import Accordion from "../utils/Accordion";
import Button from "../utils/Button";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";
import ErrorMsg from "../utils/ErrorMsg";
import { gender, meritalStatus, religion } from "../../content/data";

const PersonalInfo = ({onNext, open, onToggle}) => {
  const formik = useFormik({
    initialValues: {
      customerName: "",
      fathername: "",
      dob: "",
      mobile: "",
      email: "",
      religion: "",
      maritalStatus: "",
      gender: "",
    },

    validationSchema: Yup.object({
      customerName: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
        .required("Customer name is required"),

      fathername: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
        .required("Father name is required"),

      dob: Yup.string().required("DOB is required"),

      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter valid mobile number")
        .required("Mobile number is required"),

      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

      religion: Yup.string().required("Religion is required"),

      maritalStatus: Yup.string().required("Marital status is required"),

      gender: Yup.string().required("Gender is required"),
    }),

    onSubmit: async (values) => {
      console.log(values);
      onNext();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Accordion
        title="Customer Information"
        subtitle="Basic customer details"
        icon={RiUser3Line}
        onToggle={onToggle}
        open={open}
      >
        <div className="grid max-md:grid-cols-2 grid-cols-3 gap-4">

          <div>
            <TextInput
              label="Customer Name"
              name="customerName"
              value={formik.values.customerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.customerName &&
                formik.errors.customerName
              }
            />
          </div>

          <div>
            <TextInput
              label="Father Name"
              name="fathername"
              value={formik.values.fathername}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.fathername &&
                formik.errors.fathername
              }
            />
          </div>

          <div>
            <DateInput
              label="DOB"
              name="dob"
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.dob &&
                formik.errors.dob
              }
            />
          </div>

          <div>
            <TextInput
              label="Mobile"
              name="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.mobile &&
                formik.errors.mobile
              }
            />
          </div>

          <div>
            <TextInput
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.email &&
                formik.errors.email
              }
            />
          </div>

          <div>
            <SelectInput
              label="Religion"
              name="religion"
              options={religion}
              placeholder="select religion"
              value={formik.values.religion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.religion &&
                formik.errors.religion
              }
            />
          </div>

          <div>
            <SelectInput
              label="Marital Status"
              name="maritalStatus"
              placeholder="select merital status"
              options={meritalStatus}
              value={formik.values.maritalStatus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.maritalStatus &&
                formik.errors.maritalStatus
              }
            />
          </div>

          <div>
            <SelectInput
              label="Gender"
              name="gender"
              placeholder="select gender"
              options={gender}
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <ErrorMsg
              error={
                formik.touched.gender &&
                formik.errors.gender
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

export default PersonalInfo;