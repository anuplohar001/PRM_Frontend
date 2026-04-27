import React from "react";
import "./CustomInputs.css";

type TextInputProps = {
    label: string;
    name: string;
    value: string | undefined | null;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    type?: "text" | "textarea" | "number";
    rows?: number;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
};

const TextInput: React.FC<TextInputProps> = ({
    label,
    name,
    value,
    placeholder,
    error,
    required = false,
    disabled = false,
    type = "text",
    rows = 3,
    onChange,
}) => {
    return (
        <div className="mb-3 custom-input-wrapper">
            <label htmlFor={name} className="form-label font-size-13">
                {label}
                {required && <span className="text-danger ms-1">*</span>}
            </label>

            {type === "textarea" ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    onChange={onChange}
                    className={`form-control font-size-13 ${error ? "is-invalid" : ""
                        }`}
                />
            ) : (
                <input
                    type={type || "text"}
                    id={name}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={onChange}
                    className={`form-control font-size-13 ${error ? "is-invalid" : ""
                        }`}
                />
            )}

            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

export default TextInput;