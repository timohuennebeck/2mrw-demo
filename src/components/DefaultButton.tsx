import React from "react";

function DefaultButton({
    title,
    onClick,
    disabled,
}: {
    title: string;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="bg-black text-white text-sm hover:bg-gray-800 focus:ring-gray-900 w-full py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
        >
            {title}
        </button>
    );
}

export default DefaultButton;
