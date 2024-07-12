import React from "react";

function ExternalButton({ title, href }: { title: string; href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            className="w-full block text-center py-2.5 text-sm px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors bg-black text-white hover:bg-gray-800 focus:ring-gray-900"
        >
            {title}
        </a>
    );
}

export default ExternalButton;
