import { useState } from "react";
import {
  RiCheckboxCircleFill,
  RiFingerprintLine,
  RiIdCardLine,
} from "react-icons/ri";
import Button from "./utils/Button";
import TextInput from "./fields/TextInput";

const AadhaarVerification = ({setisFillByAadhaar}) => {
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState("");

  return (
    <div className="max-w-full mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      {/* Stepper */}

      <div className="flex items-center justify-between mb-8">

        <div className="flex flex-col items-center flex-1">

          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center
            ${
              step >= 1
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <RiFingerprintLine />
          </div>

          <p className="text-xs mt-2 text-center">
            Fill Details
          </p>

        </div>

        <div className="flex-1 h-[2px] bg-slate-200"></div>

        <div className="flex flex-col items-center flex-1">

          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center
            ${
              step >= 2
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <RiIdCardLine />
          </div>

          <p className="text-xs mt-2">
            Aadhaar
          </p>

        </div>

        {/* <div className="flex-1 h-[2px] bg-slate-200"></div>

        <div className="flex flex-col items-center flex-1">

          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center
            ${
              step === 3
                ? "bg-green-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <RiCheckboxCircleFill />
          </div>

          <p className="text-xs mt-2">
            Verified
          </p>

        </div> */}

      </div>

      {/* STEP 1 */}

      {step === 1 && (
        <div className="text-center">

          <RiFingerprintLine
            className="mx-auto text-blue-600 mb-4"
            size={55}
          />

          <h2 className="text-xl font-semibold">
            Fill Details using Aadhaar
          </h2>

          <p className="text-slate-500 mt-2 mb-6">
            Verify your Aadhaar to auto-fetch details.
          </p>

          <div className="flex justify-end">
            <Button
            btnName="Continue"
            style="bg-blue-600 text-white cursor-pointer"
            onClick={() => setStep(2)}
          />
          </div>

        </div>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <div>

          <h3 className="text-lg font-semibold mb-5">
            Aadhaar Verification
          </h3>

          <TextInput
            label="Aadhaar Number"
            placeholder="XXXX XXXX XXXX"
            maxLength={12}
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
          />

          <div className="flex justify-end mt-6">

            <Button
              btnName="Verify Aadhaar"
              style="bg-blue-600 text-white cursor-pointer"
              // onClick={() => setStep(3)}
              onClick={() => setisFillByAadhaar(false)}
            />

          </div>

        </div>
      )}

      {/* STEP 3 */}

      {/* {step === 3 && (
        <div className="text-center">

          <RiCheckboxCircleFill
            size={65}
            className="mx-auto text-green-600"
          />

          <h2 className="text-2xl font-bold mt-4">
            Aadhaar Verified
          </h2>

          <p className="text-slate-500 mt-2">
            Details have been fetched successfully.
          </p>

          <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4">

            <div className="flex justify-between py-2">

              <span>Name</span>

              <span className="font-semibold">
                Rohit Sharma
              </span>

            </div>

            <div className="flex justify-between py-2">

              <span>DOB</span>

              <span className="font-semibold">
                12 Jan 1998
              </span>

            </div>

            <div className="flex justify-between py-2">

              <span>Gender</span>

              <span className="font-semibold">
                Male
              </span>

            </div>

          </div>

        </div>
      )} */}
    </div>
  );
};

export default AadhaarVerification;