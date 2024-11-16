import { TextConstants } from "@/constants/TextConstants";
import React from "react";

const FormDivider = () => {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-neutral-500">{TextConstants.TEXT__OR}</span>
            </div>
        </div>
    );
};

export default FormDivider;
