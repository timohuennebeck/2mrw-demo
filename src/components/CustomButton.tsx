import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

interface CustomButtonParams {
    title: string;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

const CustomButton = ({ title, onClick, disabled, isLoading }: CustomButtonParams) => {
    const isDisabledOrLoading = disabled || isLoading;

    return (
        <button
            onClick={onClick}
            disabled={isDisabledOrLoading}
            className={`
                w-full py-2.5 px-4 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
                flex items-center justify-center
                ${
                    isDisabledOrLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                        : "bg-black text-white hover:bg-gray-800 focus:ring-gray-900"
                }
            `}
        >
            {isLoading ? <ArrowPathIcon className="animate-spin h-5 w-5" /> : title}
        </button>
    );
};

export default CustomButton;
