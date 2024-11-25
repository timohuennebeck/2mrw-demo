"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

interface PromoBannerProps {
    text: {
        desktop: string;
        mobile?: string;
        code?: string;
    };
    link?: {
        href: string;
        label: string;
    };
    emoji?: string;
    className?: string;
}

const PromoBanner = ({
    text,
    link,
    emoji = "🚀",
    className = "bg-black text-white",
}: PromoBannerProps) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className={`relative ${className}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-center px-3 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-x-6 text-sm">
                    <div className="flex items-center gap-x-2">
                        {emoji && <span className="hidden sm:inline">{emoji}</span>}
                        <p className="font-medium">
                            <span className="hidden sm:inline">{text.desktop} </span>
                            <span className="sm:hidden">{text.mobile || text.desktop} </span>
                            {text.code && <span className="font-semibold">{text.code}</span>}
                        </p>
                        {link && (
                            <Link
                                href={link.href}
                                className="hidden items-center gap-1 font-semibold underline-offset-4 hover:underline sm:flex"
                            >
                                <span>{link.label}</span>
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-white/10"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default PromoBanner;
