import React from "react";

function FormButton({ title, onPress }: { title: string; onPress: (formData: FormData) => void }) {
    return (
        <button
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            formAction={onPress}
        >
            {title}
        </button>
    );
}

export default FormButton;
