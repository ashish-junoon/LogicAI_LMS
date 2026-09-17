import React from "react";
import Icon from "../utils/Icon";

function SelectInput({ label, icon, name, id, options, onChange, onBlur, value, placeholder, required, disabled, readOnly, defaultValue = "" }) {
    return (
        <div>
            <label htmlFor={id} className="block mb-0.5 text-sm font-medium text-gray-700">
                {label}{required ? <span className="text-danger text-sm">*</span> : ""}
            </label>
            <div className="relative">
                {icon &&
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon name={icon} size={20} />
                </div>}
                <select
                    name={name}
                    id={id}
                    className={`h-[33px] bg-white border text-sm border-gray-300 text-gray-800 text-md rounded-md focus:ring-0.5 focus:ring-primary focus:border-primary block w-full ${icon ? "pl-10" : "px-2"} p-1.5 focus:shadow-sm focus:outline-light ${disabled ? " bg-zinc-100" : ""}`}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value ?? defaultValue}
                    disabled={disabled}
                    readOnly={readOnly}
                >
                    <option value="" label={placeholder} />
                    {options?.map((option, index) => (
                        <option key={index} value={option.value} disabled={option.isdisable} >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SelectInput;
