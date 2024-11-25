"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

const PromoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative bg-black text-white">
            <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center gap-x-6 text-sm">
                    <div className="flex items-center gap-x-2">
                        <span className="hidden sm:inline">🚀</span>
                        <p className="font-medium">
                            <span className="hidden sm:inline">
                                2mrw has just launched! Get 50% off with code{" "}
                            </span>
                            <span className="sm:hidden">Get 50% off with code </span>
                            <span className="font-semibold text-white">LAUNCH50</span>
                        </p>
                        <Link
                            href="/pricing"
                            className="hidden items-center gap-1 font-semibold text-white underline-offset-4 hover:underline sm:flex"
                        >
                            <span>Learn more</span>
                            <ArrowRight className="h-3 w-3" />
                        </Link>
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
