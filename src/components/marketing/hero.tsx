"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import TestimonialRating from "./testimonial-rating";
import CustomVideo from "../ui/custom-video";

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
    hideTestimonials?: boolean;
}

const Hero = ({
    promoText,
    title,
    subtitle,
    primaryCTA,
    secondaryCTA,
    demoVideoUrl,
    hideTestimonials,
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
            <p className="max-w-2xl text-lg text-muted-foreground">{subtitle}</p>

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

            {!hideTestimonials && <TestimonialRating />}

            {/* Demo Video */}
            {demoVideoUrl && (
                <div className="w-full max-w-5xl">
                    <CustomVideo src={demoVideoUrl} />
                </div>
            )}
        </section>
    );
};

export default Hero;
