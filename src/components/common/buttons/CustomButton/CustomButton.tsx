import React from "react";
import { Loader } from "lucide-react";
import { CustomButtonParams } from "./CustomButton.interface";

const CustomButton = ({
    title,
    onClick,
    disabled,
    isLoading,
    isSecondary,
    className,
    dataTestId,
}: CustomButtonParams) => {
    const isDisabledOrLoading = disabled || isLoading;

    return (
        <button
            onClick={onClick}
            disabled={isDisabledOrLoading}
            type="submit"
            className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium outline-none transition-colors ${className} ${
                isDisabledOrLoading
                    ? "cursor-not-allowed border border-transparent bg-neutral-300 text-neutral-500 opacity-60"
                    : isSecondary
                      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      : "border border-transparent bg-black text-white hover:bg-neutral-700"
            } `}
            data-testid={dataTestId}
        >
            {isLoading ? <Loader size={20} strokeWidth={2} className="animate-spin" /> : title}
        </button>
    );
};

export default CustomButton;
