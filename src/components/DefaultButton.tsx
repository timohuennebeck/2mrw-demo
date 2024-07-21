import React from "react";

function DefaultButton({
    title,
    onClick,
    disabled,
}: {
    title: string;
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full py-2.5 px-4 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
                ${
                    disabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                        : "bg-black text-white hover:bg-gray-800 focus:ring-gray-900"
                }
            `}
        >
            {title}
        </button>
    );
}

export default DefaultButton;
