import React from "react";

function FormButton({
    title,
    onClick,
    disabled,
}: {
    title: string;
    onClick: (formData: FormData) => void;
    disabled: boolean;
}) {
    return (
        <button
            disabled={disabled}
            className={`w-full py-2.5 text-sm px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                disabled
                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-neutral-800 focus:ring-neutral-900"
            }`}
            formAction={onClick}
        >
            {title}
        </button>
    );
}

export default FormButton;
