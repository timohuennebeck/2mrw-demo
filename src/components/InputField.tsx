import React from "react";

function InputField({
    label,
    id,
    type,
    name,
    placeholder,
    onChange,
}: {
    label: string;
    id: string;
    type: string;
    name: string;
    placeholder?: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-neutral-700">
                {`${label}*`}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 outline-neutral-800"
            />
        </div>
    );
}

export default InputField;
