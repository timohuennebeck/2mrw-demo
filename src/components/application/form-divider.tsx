import { TextConstants } from "@/constants/text-constants";
import React from "react";

const FormDivider = () => {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-black px-2 text-muted-foreground">{TextConstants.TEXT__OR}</span>
            </div>
        </div>
    );
};

export default FormDivider;
