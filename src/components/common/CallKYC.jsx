import { useEffect, useState } from "react";
import {
  RiSendPlaneLine,
  RiVideoChatLine,
  RiCheckLine,
  RiCloseLine,
  RiArrowRightLine,
  RiRefreshLine,
  RiUserLine,
  RiLoader4Line,
  RiShieldCheckLine,
} from "react-icons/ri";

import Icon from "../utils/Icon";
import Button from "../utils/Button";
import { SaveQuestionDetails } from "../../api/application";
import { useAuthData } from "../../context/authContext";
import { toast } from "react-toastify";

const PASSING_SCORE = 80;

const CallKYC = ({
  questionsData,
  answerData,
  customerId,
  applicationId,
  type = "TELECALLING",
}) => {
  const { authData } = useAuthData();
  console.log("answerData", answerData)
  const [kycStatus, setKycStatus] = useState("pending");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuetions] = useState(questionsData ?? [])
  const [savingAnswer, setSavingAnswer] = useState(false);


  useEffect(() => {
    if (!Array.isArray(answerData) || !questionsData?.length) return;

    const norm = (v) => String(v ?? "").trim().toLowerCase();

    // Tolerate the "TELECALLIN" vs "TELECALLING" style mismatch —
    // match if either string is a prefix of the other (case-insensitive).
    const typeMatches = (rowType) => {
      const a = norm(rowType);
      const b = norm(type);
      if (!a || !b) return false;
      return a === b || a.startsWith(b) || b.startsWith(a);
    };

    // question_id → "yes" | "no"  (last row wins per type+question)
    const byQuestionId = {};
    answerData.forEach((row) => {
      if (!row?.question_id || !typeMatches(row.type)) return;
      const ans = norm(row.answer);
      if (ans === "yes" || ans === "no") {
        byQuestionId[String(row.question_id)] = ans;
      }
    });

    const prefilled = {};
    questions.forEach((q, idx) => {
      const matched = byQuestionId[String(q.id)];
      if (matched) prefilled[idx] = matched;
    });

    if (Object.keys(prefilled).length === 0) return;

    setAnswers(prefilled);

    // Jump to the first unanswered question so the operator lands on
    // the next item to ask, not question 1 again.
    const firstUnanswered = questions.findIndex((_, i) => !prefilled[i]);
    setCurrentQuestion(firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);
  }, [answerData, questionsData]);

  useEffect(() => {
    if (questionsData?.length) setQuetions(questionsData);
  }, [questionsData]);

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

  const handleAnswer = async (answer) => {
    if (savingAnswer) return;

    const question = questions[currentQuestion];
    if (!question) return;

    try {
      setSavingAnswer(true);

      const payload = {
        customer_id: customerId,
        application_id: applicationId,
        question_id: String(question.id),
        answer,                                     // "yes" | "no"
        type,
        remark: "",
        created_by: authData?.user_id,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      };

      const response = await SaveQuestionDetails(payload);

      if (!response?.status) {
        toast.error(response?.message || "Failed to save answer");
        return;   // don't advance — user should retry
      }

      // Persist locally only after successful save
      setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to save answer");
    } finally {
      setSavingAnswer(false);
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
      (answer) => answer === "yes",
    ).length;

    return Math.round((yesAnswers / totalQuestions) * 100);
  };

  // =========================================================
  // ANSWER COUNTS
  // =========================================================

  const yesCount = Object.values(answers).filter(
    (answer) => answer === "yes",
  ).length;

  const noCount = Object.values(answers).filter(
    (answer) => answer === "no",
  ).length;

  const totalAnswered = Object.keys(answers).length;

  const isAllQuestionsAnswered = totalAnswered === questions.length;

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

      <div className="bg-linear-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
        <div className="flex items-center gap-3">
          {/* ICON */}

          <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
            <Icon name="PiPhone" size={21} color="#5050b8" />
          </div>

          {/* STATUS */}
          <div className="flex-1">
            <p className="text-xs text-gray-600">Live KYC Status</p>

            <p className="text-sm font-semibold text-gray-800">
              {kycStatus === "pending" && "Pending"}

              {kycStatus === "link_sent" && "Link Sent to Customer"}

              {kycStatus === "in_progress" && "Live KYC In Progress"}

              {kycStatus === "completed" &&
                (isKycPassed ? "KYC Verified" : "Re-KYC Required")}
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
          LINK SENT
      ====================================================== */}

      {(kycStatus === "pending") && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <RiSendPlaneLine size={17} className="text-blue-600" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                Live KYC Link Sent
              </p>

              <p className="text-xs text-gray-500 mt-1">
                The customer has been notified. Start the session once the
                customer joins.
              </p>

              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleStartKyc}
                  style="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  btnName="Start KYC"
                  btnIcon="PiPhone"
                />

                <Button
                  onClick={handleSendLink}
                  style="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  btnName="Send Link"
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
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3">

            {/* =================================================
          LEFT — QUESTION LIST
      ================================================== */}

            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              {/* HEADER */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <RiShieldCheckLine size={17} className="text-primary" />
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
              <div className="p-3 space-y-2 max-h-[430px] overflow-y-auto">
                {questions.map((question, index) => {
                  const answer = answers[index];
                  const isCurrent = currentQuestion === index;

                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleQuestionClick(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${isCurrent
                        ? "border-primary bg-primary/5"
                        : answer === "yes"
                          ? "border-green-200 bg-green-50"
                          : answer === "no"
                            ? "border-red-200 bg-red-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold ${answer === "yes"
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

                        <div className="flex-1">
                          <p
                            className={`text-xs leading-5 ${answer === "yes"
                              ? "text-green-700"
                              : answer === "no"
                                ? "text-red-700"
                                : isCurrent
                                  ? "text-primary font-medium"
                                  : "text-gray-600"
                              }`}
                          >
                            {question.telecaller_question}
                          </p>

                          {answer && (
                            <span
                              className={`inline-block mt-1 text-[9px] font-semibold uppercase ${answer === "yes"
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
            </div>

            {/* =================================================
          RIGHT — CURRENT QUESTION / ANSWER ACTIONS
      ================================================== */}

            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden flex flex-col">
              {/* HEADER */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-800">
                  Current Question
                </p>
                <p className="text-[10px] text-gray-500">
                  {currentQuestion + 1} of {questions.length}
                </p>
              </div>

              <div className="p-3 flex-1">
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                  <p className="text-[10px] text-primary font-semibold uppercase tracking-wide mb-0">
                    Question {currentQuestion + 1}
                  </p>

                  <p className="text-xs text-gray-700 leading-5">
                    {questions[currentQuestion]?.question}
                  </p>

                  <p className="text-[10px] text-primary font-semibold uppercase tracking-wide mt-2">
                    Expected Answer
                  </p>

                  <p className="text-xs text-gray-700 leading-5">
                    {questions[currentQuestion]?.answer}
                  </p>
                </div>

                {/* YES / NO */}
                {!answers[currentQuestion] && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleAnswer("yes")}
                      disabled={savingAnswer}
                      className="px-4 py-2.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {savingAnswer ? (
                        <RiLoader4Line size={16} className="animate-spin" />
                      ) : (
                        <RiCheckLine size={16} />
                      )}
                      Yes
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAnswer("no")}
                      disabled={savingAnswer}
                      className="px-4 py-2.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {savingAnswer ? (
                        <RiLoader4Line size={16} className="animate-spin" />
                      ) : (
                        <RiCloseLine size={16} />
                      )}
                      No
                    </button>
                  </div>
                )}

                {/* CURRENT ANSWER */}
                {answers[currentQuestion] && (
                  <div
                    className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${answers[currentQuestion] === "yes"
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                  >
                    <span>
                      Answered: {answers[currentQuestion].toUpperCase()}
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

          {/* FOOTER */}
          <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div>
              <p className="text-xs font-medium text-gray-700">
                Verification Progress
              </p>

              <p className="text-[10px] text-gray-500 mt-0.5">
                {totalAnswered} of {questions.length} questions answered
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestion === 0}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
                disabled={currentQuestion === questions.length - 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <RiArrowRightLine size={14} />
              </button>

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
              <RiCheckLine size={23} className="text-green-600" />
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
                  <span className="text-[10px] text-gray-500">Questions:</span>

                  <span className="text-xs font-semibold text-gray-700">
                    {questions.length}/{questions.length}
                  </span>
                </div>

                <div className="w-px h-4 bg-gray-300" />

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500">Yes:</span>

                  <span className="text-xs font-semibold text-green-600">
                    {yesCount}
                  </span>
                </div>

                <div className="w-px h-4 bg-gray-300" />

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500">No:</span>

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
              <RiCloseLine size={23} className="text-red-600" />
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
                  <span className="text-[10px] text-gray-500">Questions:</span>

                  <span className="text-xs font-semibold text-gray-700">
                    {questions.length}/{questions.length}
                  </span>
                </div>

                <div className="w-px h-4 bg-gray-300" />

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500">Yes:</span>

                  <span className="text-xs font-semibold text-green-600">
                    {yesCount}
                  </span>
                </div>

                <div className="w-px h-4 bg-gray-300" />

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500">No:</span>

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

export default CallKYC;
