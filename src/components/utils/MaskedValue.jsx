import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const MaskedValue = ({
  value,
  showEye = false,
  visibleDigits = 4,
  maskChar = "X",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!value) return "-";

  const str = String(value);

  const maskedValue =
    str.length <= visibleDigits
      ? str
      : maskChar.repeat(str.length - visibleDigits) +
        str.slice(-visibleDigits);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span>{showEye && isVisible ? str : maskedValue}</span>

      {showEye && (
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="text-gray-500 hover:text-gray-800"
          title={isVisible ? "Hide value" : "Show value"}
        >
          {isVisible ? (
            <RiEyeOffLine size={17} />
          ) : (
            <RiEyeLine size={17} />
          )}
        </button>
      )}
    </span>
  );
};

export default MaskedValue;