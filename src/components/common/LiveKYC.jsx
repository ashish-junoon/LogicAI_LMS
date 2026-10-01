// import { useState } from "react";
// import {
//   RiSendPlaneLine,
//   RiVideoChatLine,
//   RiCheckLine,
//   RiCloseLine,
//   RiArrowRightLine,
//   RiRefreshLine,
//   RiUserLine,
//   RiShieldCheckLine,
// } from "react-icons/ri";

// import Icon from "../utils/Icon";
// import Button from "../utils/Button";

// const LiveKYC = () => {
//   const [kycStatus, setKycStatus] = useState("pending");
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState({});

//   const questions = [
//     "Please show your original Aadhaar Card to the camera.",
//     "Please tell us your full name and date of birth.",
//     "Please show your PAN Card clearly to the camera.",
//     "Please look directly into the camera and blink twice.",
//     "Please turn your face slightly to the left and then to the right.",
//     "Please confirm the purpose for which you are applying for this loan.",
//   ];

//   // =========================================================
//   // SEND LIVE KYC LINK
//   // =========================================================

//   const handleSendLink = () => {
//     // TODO:
//     // Call API to generate and send Live KYC link

//     // Example:
//     // const response = await SendLiveKycLink({
//     //   leadId,
//     //   customerId,
//     // });

//     setKycStatus("link_sent");
//   };

//   // =========================================================
//   // START LIVE KYC
//   // =========================================================

//   const handleStartKyc = () => {
//     // TODO:
//     // Start Live KYC session API

//     setKycStatus("in_progress");
//   };

//   // =========================================================
//   // ANSWER QUESTION
//   // =========================================================

//   const handleAnswer = (answer) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [currentQuestion]: answer,
//     }));

//     // Automatically move to next question
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion((prev) => prev + 1);
//     }
//   };

//   // =========================================================
//   // SELECT QUESTION
//   // =========================================================

//   const handleQuestionClick = (index) => {
//     setCurrentQuestion(index);
//   };

//   // =========================================================
//   // CHANGE EXISTING ANSWER
//   // =========================================================

//   const handleChangeAnswer = () => {
//     setAnswers((prev) => {
//       const updated = { ...prev };

//       delete updated[currentQuestion];

//       return updated;
//     });
//   };

//   // =========================================================
//   // SCORE CALCULATION
//   // =========================================================

//   const calculateKycScore = () => {
//     const totalQuestions = questions.length;

//     if (!totalQuestions) return 0;

//     const yesAnswers = Object.values(answers).filter(
//       (answer) => answer === "yes"
//     ).length;

//     return Math.round((yesAnswers / totalQuestions) * 100);
//   };

//   // =========================================================
//   // ANSWER COUNTS
//   // =========================================================

//   const yesCount = Object.values(answers).filter(
//     (answer) => answer === "yes"
//   ).length;

//   const noCount = Object.values(answers).filter(
//     (answer) => answer === "no"
//   ).length;

//   const totalAnswered = Object.keys(answers).length;

//   const isAllQuestionsAnswered =
//     totalAnswered === questions.length;

//   // =========================================================
//   // COMPLETE KYC
//   // =========================================================

//   const handleCompleteKyc = () => {
//     if (!isAllQuestionsAnswered) return;

//     const score = calculateKycScore();

//     const payload = {
//       answers,
//       score,
//     };

//     console.log("Live KYC Payload:", payload);

//     // TODO:
//     // Complete Live KYC API
//     //
//     // Example:
//     //
//     // await CompleteLiveKyc({
//     //   answers,
//     //   score,
//     // });

//     setKycStatus("completed");
//   };

//   return (
//     <div className="space-y-3">

//       {/* =====================================================
//           STATUS HEADER
//       ====================================================== */}

//       <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">

//         <div className="flex items-center gap-3">

//           {/* ICON */}

//           <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center shrink-0">

//             <Icon
//               name="RiVideoChatLine"
//               size={21}
//               color="#5050b8"
//             />

//           </div>

//           {/* STATUS */}

//           <div className="flex-1">

//             <p className="text-xs text-gray-600">
//               Live KYC Status
//             </p>

//             <p className="text-sm font-semibold text-gray-800">

//               {kycStatus === "pending" && "Pending"}

//               {kycStatus === "link_sent" &&
//                 "Link Sent to Customer"}

//               {kycStatus === "in_progress" &&
//                 "Live KYC In Progress"}

//               {kycStatus === "completed" &&
//                 "Completed"}

//             </p>

//             <p className="text-[10px] text-gray-500 mt-0.5">

//               {kycStatus === "pending" &&
//                 "Send the Live KYC link to the customer."}

//               {kycStatus === "link_sent" &&
//                 "Customer has received the Live KYC link."}

//               {kycStatus === "in_progress" &&
//                 "Complete the verification questions during the live session."}

//               {kycStatus === "completed" &&
//                 "Live KYC verification has been completed successfully."}

//             </p>

//           </div>

//           {/* STATUS BADGE */}

//           <div>

//             {kycStatus === "pending" && (
//               <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
//                 Pending
//               </span>
//             )}

//             {kycStatus === "link_sent" && (
//               <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
//                 Link Sent
//               </span>
//             )}

//             {kycStatus === "in_progress" && (
//               <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-red-50 text-red-600 border border-red-200">
//                 Live
//               </span>
//             )}

//             {kycStatus === "completed" && (
//               <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
//                 Verified
//               </span>
//             )}

//           </div>

//         </div>

//       </div>


//       {/* =====================================================
//           PENDING
//       ====================================================== */}

//       {kycStatus === "pending" && (

//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

//           <div className="flex items-center gap-3">

//             <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">

//               <RiSendPlaneLine
//                 size={17}
//                 className="text-primary"
//               />

//             </div>

//             <div className="flex-1">

//               <p className="text-sm font-semibold text-gray-800">
//                 Send Live KYC Link
//               </p>

//               <p className="text-xs text-gray-500 mt-0.5">
//                 A Live KYC link will be automatically generated
//                 and sent to the customer.
//               </p>

//             </div>

//             <Button
//               onClick={handleSendLink}
//               style="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs"
//               btnName="Send Link"
//               btnIcon="RiSendPlaneLine"
//             />

//           </div>

//         </div>

//       )}


//       {/* =====================================================
//           LINK SENT
//       ====================================================== */}

//       {kycStatus === "link_sent" && (

//         <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">

//           <div className="flex items-start gap-3">

//             <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">

//               <RiSendPlaneLine
//                 size={17}
//                 className="text-blue-600"
//               />

//             </div>

//             <div className="flex-1">

//               <p className="text-sm font-semibold text-gray-800">
//                 Live KYC Link Sent
//               </p>

//               <p className="text-xs text-gray-500 mt-1">
//                 The customer has been notified. Start the session
//                 once the customer joins.
//               </p>

//               <div className="flex gap-2 mt-3">

//                 <Button
//                   onClick={handleStartKyc}
//                   style="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
//                   btnName="Start Live KYC"
//                   btnIcon="RiVideoChatLine"
//                 />

//                 <Button
//                   onClick={handleSendLink}
//                   style="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
//                   btnName="Resend Link"
//                   btnIcon="RiRefreshLine"
//                 />

//               </div>

//             </div>

//           </div>

//         </div>

//       )}


//       {/* =====================================================
//           LIVE KYC
//       ====================================================== */}

//       {kycStatus === "in_progress" && (

//         <div className="space-y-3">

//           {/* LIVE HEADER */}

//           <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2.5 rounded-lg">

//             <div className="flex items-center gap-2">

//               <span className="relative flex h-2.5 w-2.5">

//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />

//                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />

//               </span>

//               <span className="text-xs font-medium">
//                 LIVE KYC SESSION
//               </span>

//             </div>

//             <span className="text-[10px] text-gray-300">
//               Question {currentQuestion + 1} of{" "}
//               {questions.length}
//             </span>

//           </div>


//           {/* =================================================
//               VIDEO + QUESTIONS
//           ================================================== */}

//           <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3">

//             {/* =================================================
//                 VIDEO
//             ================================================== */}

//             <div className="bg-gray-900 rounded-lg overflow-hidden min-h-[380px]">

//               <div className="relative h-full min-h-[380px] flex items-center justify-center">

//                 {/* STATIC VIDEO */}

//                 <div className="text-center">

//                   <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-3">

//                     <RiVideoChatLine
//                       size={34}
//                       className="text-gray-400"
//                     />

//                   </div>

//                   <p className="text-sm text-gray-300">
//                     Customer Live Video
//                   </p>

//                   <p className="text-[10px] text-gray-500 mt-1">
//                     Live video stream will appear here
//                   </p>

//                 </div>


//                 {/* CUSTOMER NAME */}

//                 <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-md">

//                   <RiUserLine size={14} />

//                   <span className="text-[11px] text-white">
//                     Customer
//                   </span>

//                 </div>


//                 {/* LIVE BADGE */}

//                 <div className="absolute top-3 right-3">

//                   <span className="px-2 py-1 bg-red-500 text-white text-[9px] font-semibold rounded">
//                     LIVE
//                   </span>

//                 </div>


//                 {/* VIDEO CONTROLS */}

//                 <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">

//                   <button
//                     type="button"
//                     className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
//                   >
//                     <RiVideoChatLine size={15} />
//                   </button>

//                   <button
//                     type="button"
//                     className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
//                   >
//                     <RiCloseLine size={15} />
//                   </button>

//                 </div>

//               </div>

//             </div>


//             {/* =================================================
//                 QUESTIONS
//             ================================================== */}

//             <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">

//               {/* QUESTIONS HEADER */}

//               <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">

//                 <div className="flex items-center gap-2">

//                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">

//                     <RiShieldCheckLine
//                       size={17}
//                       className="text-primary"
//                     />

//                   </div>

//                   <div>

//                     <p className="text-sm font-semibold text-gray-800">
//                       Verification Questions
//                     </p>

//                     <p className="text-[10px] text-gray-500">
//                       Answer each question during the live call
//                     </p>

//                   </div>

//                 </div>

//               </div>


//               {/* QUESTION LIST */}

//               <div className="p-3 space-y-2 max-h-[330px] overflow-y-auto">

//                 {questions.map((question, index) => {

//                   const answer = answers[index];

//                   const isCurrent =
//                     currentQuestion === index;

//                   return (

//                     <button
//                       type="button"
//                       key={index}
//                       onClick={() =>
//                         handleQuestionClick(index)
//                       }
//                       className={`w-full text-left p-3 rounded-lg border transition-all ${
//                         isCurrent
//                           ? "border-primary bg-primary/5"
//                           : answer === "yes"
//                           ? "border-green-200 bg-green-50"
//                           : answer === "no"
//                           ? "border-red-200 bg-red-50"
//                           : "border-gray-200 hover:bg-gray-50"
//                       }`}
//                     >

//                       <div className="flex items-start gap-2.5">

//                         {/* NUMBER / ANSWER */}

//                         <div
//                           className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold ${
//                             answer === "yes"
//                               ? "bg-green-100 text-green-600"
//                               : answer === "no"
//                               ? "bg-red-100 text-red-600"
//                               : isCurrent
//                               ? "bg-primary text-white"
//                               : "bg-gray-100 text-gray-500"
//                           }`}
//                         >

//                           {answer === "yes" ? (
//                             <RiCheckLine size={14} />
//                           ) : answer === "no" ? (
//                             <RiCloseLine size={14} />
//                           ) : (
//                             index + 1
//                           )}

//                         </div>


//                         {/* QUESTION */}

//                         <div className="flex-1">

//                           <p
//                             className={`text-xs leading-5 ${
//                               answer === "yes"
//                                 ? "text-green-700"
//                                 : answer === "no"
//                                 ? "text-red-700"
//                                 : isCurrent
//                                 ? "text-primary font-medium"
//                                 : "text-gray-600"
//                             }`}
//                           >
//                             {question}
//                           </p>


//                           {/* ANSWER LABEL */}

//                           {answer && (

//                             <span
//                               className={`inline-block mt-1 text-[9px] font-semibold uppercase ${
//                                 answer === "yes"
//                                   ? "text-green-600"
//                                   : "text-red-600"
//                               }`}
//                             >
//                               Answer: {answer}
//                             </span>

//                           )}

//                         </div>

//                       </div>

//                     </button>

//                   );

//                 })}

//               </div>


//               {/* =================================================
//                   CURRENT QUESTION
//               ================================================== */}

//               <div className="border-t border-gray-100 p-3">

//                 <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">

//                   <p className="text-[10px] text-primary font-semibold uppercase tracking-wide mb-1">
//                     Question {currentQuestion + 1}
//                   </p>

//                   <p className="text-xs text-gray-700 leading-5">
//                     {questions[currentQuestion]}
//                   </p>

//                 </div>


//                 {/* YES / NO BUTTONS */}

//                 {!answers[currentQuestion] && (

//                   <div className="grid grid-cols-2 gap-2 mt-2">

//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleAnswer("yes")
//                       }
//                       className="px-4 py-2.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//                     >

//                       <RiCheckLine size={16} />

//                       Yes

//                     </button>


//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleAnswer("no")
//                       }
//                       className="px-4 py-2.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
//                     >

//                       <RiCloseLine size={16} />

//                       No

//                     </button>

//                   </div>

//                 )}


//                 {/* CURRENT ANSWER */}

//                 {answers[currentQuestion] && (

//                   <div
//                     className={`mt-2 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
//                       answers[currentQuestion] === "yes"
//                         ? "bg-green-50 text-green-700 border border-green-100"
//                         : "bg-red-50 text-red-700 border border-red-100"
//                     }`}
//                   >

//                     <span>
//                       Answered:{" "}
//                       {answers[
//                         currentQuestion
//                       ].toUpperCase()}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={handleChangeAnswer}
//                       className="text-[10px] underline"
//                     >
//                       Change
//                     </button>

//                   </div>

//                 )}

//               </div>

//             </div>

//           </div>


//           {/* =================================================
//               FOOTER / PROGRESS
//           ================================================== */}

//           <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">

//             <div>

//               <p className="text-xs font-medium text-gray-700">
//                 Verification Progress
//               </p>

//               <p className="text-[10px] text-gray-500 mt-0.5">
//                 {totalAnswered} of {questions.length} questions
//                 answered
//               </p>

//             </div>


//             <div className="flex items-center gap-2">

//               {/* PREVIOUS */}

//               <button
//                 type="button"
//                 onClick={() =>
//                   setCurrentQuestion((prev) =>
//                     Math.max(0, prev - 1)
//                   )
//                 }
//                 disabled={currentQuestion === 0}
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>


//               {/* NEXT */}

//               <button
//                 type="button"
//                 onClick={() =>
//                   setCurrentQuestion((prev) =>
//                     Math.min(
//                       questions.length - 1,
//                       prev + 1
//                     )
//                   )
//                 }
//                 disabled={
//                   currentQuestion ===
//                   questions.length - 1
//                 }
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
//               >

//                 Next

//                 <RiArrowRightLine size={14} />

//               </button>


//               {/* COMPLETE */}

//               <button
//                 type="button"
//                 onClick={handleCompleteKyc}
//                 disabled={!isAllQuestionsAnswered}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
//               >

//                 <RiCheckLine size={15} />

//                 Complete KYC

//               </button>

//             </div>

//           </div>

//         </div>

//       )}


//       {/* =====================================================
//           COMPLETED
//       ====================================================== */}

//       {kycStatus === "completed" && (

//         <div className="border border-green-200 bg-green-50 rounded-lg p-5">

//           <div className="flex items-center gap-4">

//             {/* SUCCESS ICON */}

//             <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">

//               <RiCheckLine
//                 size={23}
//                 className="text-green-600"
//               />

//             </div>


//             {/* CONTENT */}

//             <div className="flex-1">

//               <p className="text-sm font-semibold text-green-800">
//                 Live KYC Completed
//               </p>

//               <p className="text-xs text-green-700 mt-0.5">
//                 Customer verification has been completed successfully.
//               </p>


//               {/* COUNTS */}

//               <div className="flex items-center gap-3 mt-3">

//                 <div className="flex items-center gap-1.5">

//                   <span className="text-[10px] text-gray-500">
//                     Questions:
//                   </span>

//                   <span className="text-xs font-semibold text-gray-700">
//                     {questions.length}/{questions.length}
//                   </span>

//                 </div>


//                 <div className="w-px h-4 bg-gray-300" />


//                 <div className="flex items-center gap-1.5">

//                   <span className="text-[10px] text-gray-500">
//                     Yes:
//                   </span>

//                   <span className="text-xs font-semibold text-green-600">
//                     {yesCount}
//                   </span>

//                 </div>


//                 <div className="w-px h-4 bg-gray-300" />


//                 <div className="flex items-center gap-1.5">

//                   <span className="text-[10px] text-gray-500">
//                     No:
//                   </span>

//                   <span className="text-xs font-semibold text-red-600">
//                     {noCount}
//                   </span>

//                 </div>

//               </div>

//             </div>


//             {/* =================================================
//                 SCORE
//             ================================================== */}

//             <div className="text-center px-5 border-l border-green-200 min-w-[110px]">

//               <p className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
//                 KYC Score
//               </p>

//               <p className="text-3xl font-bold text-green-600 leading-none mt-1">
//                 {calculateKycScore()}%
//               </p>

//               <p className="text-[9px] text-gray-500 mt-1">
//                 Verification Score
//               </p>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// };

// export default LiveKYC;


import { useState } from "react";
import {
  RiSendPlaneLine,
  RiVideoChatLine,
  RiCheckLine,
  RiCloseLine,
  RiArrowRightLine,
  RiRefreshLine,
  RiUserLine,
  RiShieldCheckLine,
} from "react-icons/ri";

import Icon from "../utils/Icon";
import Button from "../utils/Button";

const PASSING_SCORE = 80;

const LiveKYC = () => {
  const [kycStatus, setKycStatus] = useState("pending");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    "Please show your original Aadhaar Card to the camera.",
    "Please tell us your full name and date of birth.",
    "Please show your PAN Card clearly to the camera.",
    "Please look directly into the camera and blink twice.",
    "Please turn your face slightly to the left and then to the right.",
    "Please confirm the purpose for which you are applying for this loan.",
  ];

  // =========================================================
  // SEND LIVE KYC LINK
  // =========================================================

  const handleSendLink = () => {
    // TODO:
    // API call to generate and send Live KYC link

    setKycStatus("link_sent");
  };

  // =========================================================
  // START LIVE KYC
  // =========================================================

  const handleStartKyc = () => {
    // TODO:
    // Start Live KYC session API

    setKycStatus("in_progress");
  };

  // =========================================================
  // ANSWER QUESTION
  // =========================================================

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));

    // Move to next question automatically
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // =========================================================
  // SELECT QUESTION
  // =========================================================

  const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
  };

  // =========================================================
  // CHANGE ANSWER
  // =========================================================

  const handleChangeAnswer = () => {
    setAnswers((prev) => {
      const updated = { ...prev };

      delete updated[currentQuestion];

      return updated;
    });
  };

  // =========================================================
  // SCORE
  // =========================================================

  const calculateKycScore = () => {
    const totalQuestions = questions.length;

    if (!totalQuestions) return 0;

    const yesAnswers = Object.values(answers).filter(
      (answer) => answer === "yes"
    ).length;

    return Math.round((yesAnswers / totalQuestions) * 100);
  };

  // =========================================================
  // ANSWER COUNTS
  // =========================================================

  const yesCount = Object.values(answers).filter(
    (answer) => answer === "yes"
  ).length;

  const noCount = Object.values(answers).filter(
    (answer) => answer === "no"
  ).length;

  const totalAnswered = Object.keys(answers).length;

  const isAllQuestionsAnswered =
    totalAnswered === questions.length;

  // =========================================================
  // COMPLETE KYC
  // =========================================================

  const handleCompleteKyc = () => {
    if (!isAllQuestionsAnswered) return;

    const score = calculateKycScore();

    const payload = {
      answers,
      score,
      status: score >= PASSING_SCORE ? "verified" : "re_kyc_required",
    };

    console.log("Live KYC Payload:", payload);

    // TODO:
    // Complete Live KYC API
    //
    // await CompleteLiveKyc(payload);

    setKycStatus("completed");
  };

  // =========================================================
  // RETRY KYC
  // =========================================================

  const handleRetryKyc = () => {
    // TODO:
    // Reset / create new Live KYC session API
    //
    // await RetryLiveKyc();

    setAnswers({});
    setCurrentQuestion(0);

    // Same flow from beginning
    setKycStatus("pending");
  };

  const finalScore = calculateKycScore();
  const isKycPassed = finalScore >= PASSING_SCORE;

  return (
    <div className="space-y-3">

      {/* =====================================================
          STATUS HEADER
      ====================================================== */}

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">

        <div className="flex items-center gap-3">

          {/* ICON */}

          <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center shrink-0">

            <Icon
              name="RiVideoChatLine"
              size={21}
              color="#5050b8"
            />

          </div>

          {/* STATUS */}

          <div className="flex-1">

            <p className="text-xs text-gray-600">
              Live KYC Status
            </p>

            <p className="text-sm font-semibold text-gray-800">

              {kycStatus === "pending" && "Pending"}

              {kycStatus === "link_sent" &&
                "Link Sent to Customer"}

              {kycStatus === "in_progress" &&
                "Live KYC In Progress"}

              {kycStatus === "completed" &&
                (isKycPassed
                  ? "KYC Verified"
                  : "Re-KYC Required")}

            </p>

            <p className="text-[10px] text-gray-500 mt-0.5">

              {kycStatus === "pending" &&
                "Send the Live KYC link to the customer."}

              {kycStatus === "link_sent" &&
                "Customer has received the Live KYC link."}

              {kycStatus === "in_progress" &&
                "Complete the verification questions during the live session."}

              {kycStatus === "completed" &&
                (isKycPassed
                  ? "Customer verification has been successfully completed."
                  : "KYC score is below the required 80%. Re-KYC is required.")}

            </p>

          </div>

          {/* STATUS BADGE */}

          <div>

            {kycStatus === "pending" && (
              <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                Pending
              </span>
            )}

            {kycStatus === "link_sent" && (
              <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Link Sent
              </span>
            )}

            {kycStatus === "in_progress" && (
              <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-red-50 text-red-600 border border-red-200">
                Live
              </span>
            )}

            {kycStatus === "completed" && isKycPassed && (
              <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
                Verified
              </span>
            )}

            {kycStatus === "completed" && !isKycPassed && (
              <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-red-50 text-red-600 border border-red-200">
                Re-KYC Required
              </span>
            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          PENDING
      ====================================================== */}

      {kycStatus === "pending" && (

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">

              <RiSendPlaneLine
                size={17}
                className="text-primary"
              />

            </div>

            <div className="flex-1">

              <p className="text-sm font-semibold text-gray-800">
                Send Live KYC Link
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                A Live KYC link will be automatically generated
                and sent to the customer.
              </p>

            </div>

            <Button
              onClick={handleSendLink}
              style="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs"
              btnName="Send Link"
              btnIcon="RiSendPlaneLine"
            />

          </div>

        </div>

      )}


      {/* =====================================================
          LINK SENT
      ====================================================== */}

      {kycStatus === "link_sent" && (

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">

              <RiSendPlaneLine
                size={17}
                className="text-blue-600"
              />

            </div>

            <div className="flex-1">

              <p className="text-sm font-semibold text-gray-800">
                Live KYC Link Sent
              </p>

              <p className="text-xs text-gray-500 mt-1">
                The customer has been notified. Start the session
                once the customer joins.
              </p>

              <div className="flex gap-2 mt-3">

                <Button
                  onClick={handleStartKyc}
                  style="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  btnName="Start Live KYC"
                  btnIcon="RiVideoChatLine"
                />

                <Button
                  onClick={handleSendLink}
                  style="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  btnName="Resend Link"
                  btnIcon="RiRefreshLine"
                />

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          LIVE KYC
      ====================================================== */}

      {kycStatus === "in_progress" && (

        <div className="space-y-3">

          {/* LIVE HEADER */}

          <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2.5 rounded-lg">

            <div className="flex items-center gap-2">

              <span className="relative flex h-2.5 w-2.5">

                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />

                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />

              </span>

              <span className="text-xs font-medium">
                LIVE KYC SESSION
              </span>

            </div>

            <span className="text-[10px] text-gray-300">
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </span>

          </div>


          {/* =================================================
              VIDEO + QUESTIONS
          ================================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3">

            {/* =================================================
                VIDEO
            ================================================== */}

            <div className="bg-gray-900 rounded-lg overflow-hidden min-h-[380px]">

              <div className="relative h-full min-h-[380px] flex items-center justify-center">

                {/* STATIC VIDEO */}

                <div className="text-center">

                  <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-3">

                    <RiVideoChatLine
                      size={34}
                      className="text-gray-400"
                    />

                  </div>

                  <p className="text-sm text-gray-300">
                    Customer Live Video
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    Live video stream will appear here
                  </p>

                </div>


                {/* CUSTOMER */}

                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-md">

                  <RiUserLine size={14} />

                  <span className="text-[11px] text-white">
                    Customer
                  </span>

                </div>


                {/* LIVE */}

                <div className="absolute top-3 right-3">

                  <span className="px-2 py-1 bg-red-500 text-white text-[9px] font-semibold rounded">
                    LIVE
                  </span>

                </div>


                {/* CONTROLS */}

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">

                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                  >
                    <RiVideoChatLine size={15} />
                  </button>

                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                  >
                    <RiCloseLine size={15} />
                  </button>

                </div>

              </div>

            </div>


            {/* =================================================
                QUESTIONS
            ================================================== */}

            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">

              {/* HEADER */}

              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">

                <div className="flex items-center gap-2">

                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">

                    <RiShieldCheckLine
                      size={17}
                      className="text-primary"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Verification Questions
                    </p>

                    <p className="text-[10px] text-gray-500">
                      Answer each question during the live call
                    </p>

                  </div>

                </div>

              </div>


              {/* QUESTION LIST */}

              <div className="p-3 space-y-2 max-h-[330px] overflow-y-auto">

                {questions.map((question, index) => {

                  const answer = answers[index];

                  const isCurrent =
                    currentQuestion === index;

                  return (

                    <button
                      type="button"
                      key={index}
                      onClick={() =>
                        handleQuestionClick(index)
                      }
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isCurrent
                          ? "border-primary bg-primary/5"
                          : answer === "yes"
                          ? "border-green-200 bg-green-50"
                          : answer === "no"
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >

                      <div className="flex items-start gap-2.5">

                        {/* NUMBER */}

                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold ${
                            answer === "yes"
                              ? "bg-green-100 text-green-600"
                              : answer === "no"
                              ? "bg-red-100 text-red-600"
                              : isCurrent
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >

                          {answer === "yes" ? (
                            <RiCheckLine size={14} />
                          ) : answer === "no" ? (
                            <RiCloseLine size={14} />
                          ) : (
                            index + 1
                          )}

                        </div>


                        {/* QUESTION */}

                        <div className="flex-1">

                          <p
                            className={`text-xs leading-5 ${
                              answer === "yes"
                                ? "text-green-700"
                                : answer === "no"
                                ? "text-red-700"
                                : isCurrent
                                ? "text-primary font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {question}
                          </p>


                          {/* ANSWER */}

                          {answer && (

                            <span
                              className={`inline-block mt-1 text-[9px] font-semibold uppercase ${
                                answer === "yes"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              Answer: {answer}
                            </span>

                          )}

                        </div>

                      </div>

                    </button>

                  );

                })}

              </div>


              {/* =================================================
                  CURRENT QUESTION
              ================================================== */}

              <div className="border-t border-gray-100 p-3">

                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">

                  <p className="text-[10px] text-primary font-semibold uppercase tracking-wide mb-1">
                    Question {currentQuestion + 1}
                  </p>

                  <p className="text-xs text-gray-700 leading-5">
                    {questions[currentQuestion]}
                  </p>

                </div>


                {/* YES / NO */}

                {!answers[currentQuestion] && (

                  <div className="grid grid-cols-2 gap-2 mt-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleAnswer("yes")
                      }
                      className="px-4 py-2.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >

                      <RiCheckLine size={16} />

                      Yes

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleAnswer("no")
                      }
                      className="px-4 py-2.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >

                      <RiCloseLine size={16} />

                      No

                    </button>

                  </div>

                )}


                {/* CURRENT ANSWER */}

                {answers[currentQuestion] && (

                  <div
                    className={`mt-2 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                      answers[currentQuestion] === "yes"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                  >

                    <span>
                      Answered:{" "}
                      {answers[
                        currentQuestion
                      ].toUpperCase()}
                    </span>

                    <button
                      type="button"
                      onClick={handleChangeAnswer}
                      className="text-[10px] underline"
                    >
                      Change
                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">

            <div>

              <p className="text-xs font-medium text-gray-700">
                Verification Progress
              </p>

              <p className="text-[10px] text-gray-500 mt-0.5">
                {totalAnswered} of {questions.length} questions
                answered
              </p>

            </div>


            <div className="flex items-center gap-2">

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.max(0, prev - 1)
                  )
                }
                disabled={currentQuestion === 0}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>


              {/* NEXT */}

              <button
                type="button"
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(
                      questions.length - 1,
                      prev + 1
                    )
                  )
                }
                disabled={
                  currentQuestion ===
                  questions.length - 1
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >

                Next

                <RiArrowRightLine size={14} />

              </button>


              {/* COMPLETE */}

              <button
                type="button"
                onClick={handleCompleteKyc}
                disabled={!isAllQuestionsAnswered}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >

                <RiCheckLine size={15} />

                Complete KYC

              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          COMPLETED - PASSED
      ====================================================== */}

      {kycStatus === "completed" && isKycPassed && (

        <div className="border border-green-200 bg-green-50 rounded-lg p-5">

          <div className="flex items-center gap-4">

            {/* ICON */}

            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">

              <RiCheckLine
                size={23}
                className="text-green-600"
              />

            </div>


            {/* CONTENT */}

            <div className="flex-1">

              <p className="text-sm font-semibold text-green-800">
                Live KYC Verified
              </p>

              <p className="text-xs text-green-700 mt-0.5">
                Customer verification has been completed successfully.
              </p>


              <div className="flex items-center gap-3 mt-3">

                <div className="flex items-center gap-1.5">

                  <span className="text-[10px] text-gray-500">
                    Questions:
                  </span>

                  <span className="text-xs font-semibold text-gray-700">
                    {questions.length}/{questions.length}
                  </span>

                </div>


                <div className="w-px h-4 bg-gray-300" />


                <div className="flex items-center gap-1.5">

                  <span className="text-[10px] text-gray-500">
                    Yes:
                  </span>

                  <span className="text-xs font-semibold text-green-600">
                    {yesCount}
                  </span>

                </div>


                <div className="w-px h-4 bg-gray-300" />


                <div className="flex items-center gap-1.5">

                  <span className="text-[10px] text-gray-500">
                    No:
                  </span>

                  <span className="text-xs font-semibold text-red-600">
                    {noCount}
                  </span>

                </div>

              </div>

            </div>


            {/* SCORE */}

            <div className="text-center px-5 border-l border-green-200 min-w-[110px]">

              <p className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
                KYC Score
              </p>

              <p className="text-3xl font-bold text-green-600 leading-none mt-1">
                {finalScore}%
              </p>

              <p className="text-[9px] text-green-600 mt-1 font-medium">
                PASSED
              </p>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          COMPLETED - FAILED / RE-KYC
      ====================================================== */}

      {kycStatus === "completed" && !isKycPassed && (

        <div className="border border-red-200 bg-red-50 rounded-lg p-5">

          <div className="flex items-center gap-4">

            {/* ICON */}

            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0">

              <RiCloseLine
                size={23}
                className="text-red-600"
              />

            </div>


            {/* CONTENT */}

            <div className="flex-1">

              <p className="text-sm font-semibold text-red-800">
                Re-KYC Required
              </p>

              <p className="text-xs text-red-700 mt-0.5">
                The KYC score is below the required
                {` ${PASSING_SCORE}%`} threshold.
              </p>


              <div className="flex items-center gap-3 mt-3">

                <div className="flex items-center gap-1.5">

                  <span className="text-[10px] text-gray-500">
                    Questions:
                  </span>

                  <span className="text-xs font-semibold text-gray-700">
                    {questions.length}/{questions.length}
                  </span>

                </div>


                <div className="w-px h-4 bg-gray-300" />


                <div className="flex items-center gap-1.5">

                  <span className="text-[10px] text-gray-500">
                    Yes:
                  </span>

                  <span className="text-xs font-semibold text-green-600">
                    {yesCount}
                  </span>

                </div>


                <div className="w-px h-4 bg-gray-300" />


                <div className="flex items-center gap-1.5">

                  <span className="text-[10px] text-gray-500">
                    No:
                  </span>

                  <span className="text-xs font-semibold text-red-600">
                    {noCount}
                  </span>

                </div>

              </div>

            </div>


            {/* SCORE */}

            <div className="text-center px-5 border-l border-red-200 min-w-[110px]">

              <p className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
                KYC Score
              </p>

              <p className="text-3xl font-bold text-red-600 leading-none mt-1">
                {finalScore}%
              </p>

              <p className="text-[9px] text-red-600 mt-1 font-medium">
                BELOW 80%
              </p>

            </div>

          </div>


          {/* RETRY */}

          <div className="mt-4 pt-4 border-t border-red-200 flex items-center justify-between">

            <div>

              <p className="text-xs font-medium text-red-800">
                Customer needs to complete Live KYC again.
              </p>

              <p className="text-[10px] text-red-600 mt-0.5">
                A new KYC session will be started.
              </p>

            </div>

            <button
              type="button"
              onClick={handleRetryKyc}
              className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >

              <RiRefreshLine size={15} />

              Retry Live KYC

            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default LiveKYC;