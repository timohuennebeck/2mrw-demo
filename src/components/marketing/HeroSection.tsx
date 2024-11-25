"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import TestimonialRating from "./TestimonialRating";

interface HeroSectionProps {
    promoText?: string;
    title: React.ReactNode;
    subtitle: string;
    primaryCTA: {
        text: string;
        href: string;
    };
    secondaryCTA?: {
        text: string;
        onClick?: () => void;
    };
    demoVideoUrl?: string;
    showTestimonials?: boolean;
}

const HeroSection = ({
    promoText,
    title,
    subtitle,
    primaryCTA,
    secondaryCTA,
    demoVideoUrl,
    showTestimonials = true,
}: HeroSectionProps) => {
    return (
        <section className="flex flex-col items-center justify-center gap-8 px-4 py-10 text-center">
            {/* Promotional Banner */}
            {promoText && (
                <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                    {promoText}
                </div>
            )}

            {/* Main Title */}
            <h1 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                {title}
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl text-lg text-gray-600">{subtitle}</p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <Link
                    href={primaryCTA.href}
                    className="rounded-md bg-black px-6 py-2.5 text-white transition-colors hover:bg-gray-800"
                >
                    {primaryCTA.text}
                </Link>
                {secondaryCTA && (
                    <button
                        onClick={secondaryCTA.onClick}
                        className="flex items-center justify-center gap-2 rounded-md bg-gray-100 px-6 py-2.5 transition-colors hover:bg-gray-200"
                    >
                        <Play size={16} className="fill-current" />
                        {secondaryCTA.text}
                    </button>
                )}
            </div>

            {showTestimonials && <TestimonialRating />}

            {/* Demo Video */}
            {demoVideoUrl && (
                <div className="relative w-full max-w-5xl">
                    <video
                        src={demoVideoUrl}
                        width={1200}
                        height={675}
                        className="rounded-lg shadow-2xl"
                        autoPlay
                        muted
                        loop
                    />
                </div>
            )}
        </section>
    );
};

export default HeroSection;