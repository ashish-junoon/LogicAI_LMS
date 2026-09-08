import React from "react";

const TogleInput = ({
  checked = false,
  disabled = false,
  onChange,
  name,
  id,
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />

      <div
        className="
          relative
          w-11 h-6
          rounded-full
          bg-gray-200
          transition-colors
          peer-checked:bg-primary
          peer-focus-visible:ring-2
          peer-focus-visible:ring-primary/30
          after:content-['']
          after:absolute
          after:top-0.5
          after:left-0.5
          after:h-5
          after:w-5
          after:rounded-full
          after:bg-white
          after:border
          after:border-gray-300
          after:transition-transform
          peer-checked:after:translate-x-full
        "
      />
    </label>
  );
};

export default TogleInput;