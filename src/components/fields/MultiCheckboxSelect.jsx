import React, { useEffect, useRef, useState } from "react";
import { RiArrowDownSLine, RiCheckLine } from "react-icons/ri";

function MultiCheckboxSelect({
    label,
    name,
    id,
    options = [],
    value = [],
    onChange,
    placeholder = "ALL",
    required = false,
    disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const selected = Array.isArray(value) ? value : [];

    // Outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const toggleOption = (optionValue) => {
        if (disabled) return;

        const newValue = selected.includes(optionValue)
            ? selected.filter((item) => item !== optionValue)
            : [...selected, optionValue];

        onChange?.({
            target: {
                name,
                value: newValue,
            },
        });
    };

    const selectedLabels = options
        .filter((option) => selected.includes(option.value))
        .map((option) => option.label);

    return (
        <div
            ref={wrapperRef}
            className="relative w-full"
        >
            {/* Label */}
            {label && (
                <label
                    htmlFor={id}
                    className="mb-0.5 block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </label>
            )}

            {/* Input */}
            <div
                id={id}
                onClick={() => {
                    if (!disabled) {
                        setOpen((prev) => !prev);
                    }
                }}
                className={`flex h-[33px] w-full cursor-pointer items-center justify-between rounded-md border bg-white px-2 text-sm
                    ${
                        open
                            ? "border-primary ring-1 ring-primary"
                            : "border-gray-300"
                    }
                    ${
                        disabled
                            ? "cursor-not-allowed bg-zinc-100"
                            : "hover:border-primary"
                    }
                `}
            >
                <span
                    className={`truncate ${
                        selectedLabels.length
                            ? "text-gray-800"
                            : "text-gray-500"
                    }`}
                >
                    {selectedLabels.length
                        ? selectedLabels.join(", ")
                        : placeholder}
                </span>

                <RiArrowDownSLine
                    size={19}
                    className={`shrink-0 text-gray-500 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </div>

            {/* Dropdown */}
            {open && !disabled && (
                <div
                    className="absolute left-0 right-0 top-[58px] z-[99999] rounded-md border border-gray-200 bg-white shadow-xl"
                >
                    {options.map((option) => {
                        const checked = selected.includes(option.value);

                        return (
                            <div
                                key={option.value}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (!option.isdisable) {
                                        toggleOption(option.value);
                                    }
                                }}
                                className={`flex h-[36px] items-center gap-2 px-3 text-sm
                                    ${
                                        option.isdisable
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer hover:bg-gray-100"
                                    }
                                `}
                            >
                                {/* Checkbox */}
                                <div
                                    className={`flex h-4 w-4 items-center justify-center rounded border
                                        ${
                                            checked
                                                ? "border-primary bg-primary text-white"
                                                : "border-gray-300 bg-white"
                                        }
                                    `}
                                >
                                    {checked && (
                                        <RiCheckLine size={13} />
                                    )}
                                </div>

                                {/* Text */}
                                <span>{option.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MultiCheckboxSelect;