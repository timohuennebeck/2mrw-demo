import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

function InputField({
    label,
    id,
    type,
    name,
    placeholder,
    onChange,
    onFocus,
    onBlur,
}: {
    label: string;
    id: string;
    type: string;
    name: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="">
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-neutral-700">
                {`${label}*`}
            </label>

            <div className="relative">
                <input
                    type={showPassword ? "text" : type}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-neutral-800 ${type === "password" && "pr-10"}`}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />

                {type === "password" && (
                    <div
                        className="absolute inset-y-0 right-3.5 flex h-full w-5 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </div>
                )}
            </div>
        </div>
    );
}

export default InputField;
