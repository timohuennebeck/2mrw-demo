import React from "react";

function InputField({
    label,
    id,
    type,
    name,
}: {
    label: string;
    id: string;
    type: string;
    name: string;
}) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {`${label}*`}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}

export default InputField;
