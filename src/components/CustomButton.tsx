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
            className={`flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm transition-colors outline-none font-medium ${
                isDisabledOrLoading
                    ? "cursor-not-allowed bg-gray-300 text-gray-500 opacity-60"
                    : "bg-black text-white hover:bg-gray-800 focus:ring-gray-900"
            } `}
        >
            {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : title}
        </button>
    );
};

export default CustomButton;
