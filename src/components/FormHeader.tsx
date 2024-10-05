import React from "react";

function FormHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-semibold text-center">{title}</h2>
            <p className="text-sm text-neutral-600 text-center">{subtitle}</p>
        </div>
    );
}

export default FormHeader;
