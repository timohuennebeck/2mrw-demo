import React from "react";

function MainButton({ title }: { title: string }) {
    return (
        <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
        >
            {title}
        </button>
    );
}

export default MainButton;
