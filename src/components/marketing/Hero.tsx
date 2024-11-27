"use client";

import { Play } from "lucide-react";
import TestimonialRating from "./TestimonialRating";

interface HeroProps {
    promoText?: string;
    title: React.ReactNode;
    subtitle: string;
    primaryCTA: {
        text: string;
        onClick?: (e: React.MouseEvent) => void;
    };
    secondaryCTA?: {
        text: string;
        onClick?: (e: React.MouseEvent) => void;
    };
    demoVideoUrl?: string;
    showTestimonials?: boolean;
}

const Hero = ({
    promoText,
    title,
    subtitle,
    primaryCTA,
    secondaryCTA,
    demoVideoUrl,
    showTestimonials = true,
}: HeroProps) => {
    return (
        <section className="relative flex flex-col items-center justify-center gap-8 px-4 py-10 text-center">
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
            <p className="max-w-2xl text-lg text-gray-600">{subtitle}</p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <button
                    className="rounded-md bg-black px-6 py-2.5 text-white transition-colors hover:bg-gray-800"
                    onClick={primaryCTA.onClick}
                >
                    {primaryCTA.text}
                </button>
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

export default Hero;
