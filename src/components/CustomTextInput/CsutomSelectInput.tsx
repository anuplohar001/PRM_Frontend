import React from "react";
import "./CustomInputs.css";
import type { Option } from "../../utils/types";


type CustomSelectProps = {
    label: string;
    name: string;
    value: number | string | null;
    options: Option[];
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
    label,
    name,
    value,
    options,
    placeholder = "Select an option",
    error,
    required = false,
    disabled = false,
    onChange,
}) => {
    return (
        <div className="mb-3 custom-input-wrapper">
            <label htmlFor={name} className="form-label">
                {label}
                {required && <span className="text-danger ms-1">*</span>}
            </label>

            <select
                id={name}
                name={name}
                value={value || ""}
                disabled={disabled}
                onChange={onChange}
                className={`form-select font-size-13 ${error ? "is-invalid" : ""
                    }`}
            >
                <option value="" disabled>
                    {placeholder}
                </option>

                {options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

export default CustomSelect;