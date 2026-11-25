import { RiBankCardLine } from "react-icons/ri";

const CreditInfo = ({ creditData }) => {
  if (!creditData?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <RiBankCardLine className="mb-3 text-3xl text-gray-400" />
        <p className="text-sm font-semibold text-gray-700">
          No credit score available
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Credit information has not been received for this customer.
        </p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 750) return "bg-green-100";
    if (score >= 650) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-4">
      {creditData.map((data, index) => {
        const score = data?.credit_score;

        const hasScore =
          score !== null &&
          score !== "" &&
          score !== undefined &&
          Number.isFinite(Number(score));

        const scoreValue = hasScore ? Number(score) : null;

        return (
          <div key={data?.request_id || index} className="space-y-4 shadow-xl rounded-sm border border-gray-200 p-5">
            {/* Credit Score */}
            <div className="bg-linear-to-r from-primary/5 to-indigo-50 p-4 rounded-lg border border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Credit Score
                  </p>

                  <p
                    className={`text-3xl font-bold ${
                      hasScore ? getScoreColor(scoreValue) : "text-gray-400"
                    }`}
                  >
                    {hasScore ? score : "—"}
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        hasScore
                          ? getScoreColor(scoreValue)
                          : "text-gray-500"
                      }`}
                    >
                      {data?.status || "Not available"}
                    </span>
                  </p>
                </div>

                <div
                  className={`w-16 h-16 rounded-full ${
                    hasScore ? getScoreBg(scoreValue) : "bg-gray-100"
                  } flex items-center justify-center`}
                >
                  <RiBankCardLine
                    className={`text-2xl ${
                      hasScore ? getScoreColor(scoreValue) : "text-gray-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Bureau
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {data?.bureau_name || "—"}
                </p>
                <p className="text-[10px] text-gray-400">
                  {data?.customer_type || "—"}
                </p>
              </div>

              <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Credit Type
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {data?.credit_type || "—"}
                </p>
              </div>

              <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Request ID
                </p>
                <p className="text-sm font-semibold text-gray-800 break-all">
                  {data?.request_id || "—"}
                </p>
              </div>

              <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Requested On
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {data?.request_date || "—"}
                </p>
              </div>
            </div>

            {data?.credit_report_link && (
              <a
                className="inline-block text-xs text-white hover:underline bg-primary px-5 py-2 rounded-lg"
                href={data.credit_report_link}
                target="_blank"
                rel="noreferrer"
              >
                View credit report
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CreditInfo;