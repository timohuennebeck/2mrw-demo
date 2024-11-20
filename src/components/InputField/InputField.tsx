import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { OctagonX } from "lucide-react";
import { InputFieldParams } from "./InputField.interface";

function InputField({
    label,
    hideLabel = false,
    disabled = false,
    id,
    value,
    type,
    name,
    dataTestId,
    placeholder,
    error,
    hasError,
    onChange,
    onFocus,
    onBlur,
}: InputFieldParams) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            {!hideLabel && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
                    {`${label}*`}
                </label>
            )}

            <div className="relative">
                <input
                    type={showPassword ? "text" : type}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm outline-gray-800 ${type === "password" && "pr-10"} ${disabled && "bg-gray-100 text-gray-400"} ${hasError ? "border-red-500" : "border-gray-300"} ${hasError ? "focus:border-red-500" : "focus:border-gray-800"}`}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    disabled={disabled}
                    data-testid={dataTestId}
                />

                {type === "password" && !disabled && (
                    <div
                        className="absolute inset-y-0 right-3.5 flex h-full w-5 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        data-testid="password-toggle"
                    >
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-1">
                    <OctagonX className="h-4 w-4 text-red-500" />
                    <p className="mt-1 text-sm text-red-500" data-testid={`${dataTestId}-error`}>
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}

export default InputField;
