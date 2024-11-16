import React from "react";
import { FormHeaderParams } from "./FormHeader.interface";

const FormHeader = ({ title, subtitle }: FormHeaderParams) => {
    return (
        <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-center text-2xl font-semibold">{title}</h2>
            <p className="text-center text-sm text-neutral-600">{subtitle}</p>
        </div>
    );
};

export default FormHeader;
