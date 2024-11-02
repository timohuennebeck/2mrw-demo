import React from "react";
import { Loader } from "lucide-react";

interface CustomButtonParams {
    title: string;
    onClick?: () => void;
    isSecondary?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
}

const CustomButton = ({ title, onClick, disabled, isLoading, isSecondary }: CustomButtonParams) => {
    const isDisabledOrLoading = disabled || isLoading;

    return (
        <button
            onClick={onClick}
            disabled={isDisabledOrLoading}
            type="submit"
            className={`flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium outline-none transition-colors ${
                isDisabledOrLoading
                    ? "cursor-not-allowed bg-neutral-300 text-neutral-500 opacity-60 border border-transparent"
                    : isSecondary
                      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-black border border-transparent text-white hover:bg-neutral-700"
            } `}
        >
            {isLoading ? <Loader size={20} strokeWidth={2} className="animate-spin" /> : title}
        </button>
    );
};

export default CustomButton;
