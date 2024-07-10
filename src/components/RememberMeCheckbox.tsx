import React from "react";

function RememberMeCheckbox() {
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
            </label>
        </div>
    );
}

export default RememberMeCheckbox;
