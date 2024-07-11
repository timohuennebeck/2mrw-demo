import React from "react";

function FormButton({
    title,
    onPress,
    disabled,
}: {
    title: string;
    onPress: (formData: FormData) => void;
    disabled: boolean;
}) {
    return (
        <button
            disabled={disabled}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                disabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 focus:ring-gray-900"
            }`}
            formAction={onPress}
        >
            {title}
        </button>
    );
}

export default FormButton;
