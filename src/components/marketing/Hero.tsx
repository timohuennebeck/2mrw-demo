"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import TestimonialRating from "./testimonial-rating";

interface HeroParams {
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
    showTestimonials,
}: HeroParams) => {
    return (
        <section className="relative flex flex-col items-center justify-center gap-8 text-center">
            {/* Promotional Banner */}
            {promoText && (
                <div className="px-4 py-2 text-sm font-medium text-blue-600">{promoText}</div>
            )}

            {/* Main Title */}
            <h1 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                {title}
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-lg text-gray-600">{subtitle}</p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <Button size="lg" onClick={primaryCTA.onClick}>
                    {primaryCTA.text}
                    <ArrowRight size={16} />
                </Button>
                {secondaryCTA && (
                    <Button size="lg" variant="secondary" onClick={secondaryCTA.onClick}>
                        {secondaryCTA.text}
                    </Button>
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
