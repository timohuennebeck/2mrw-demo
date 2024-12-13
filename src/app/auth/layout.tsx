"use client";

import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import QuouteBlackImg from "@/assets/quotes.svg";
import QuoteWhiteImg from "@/assets/quotes-white.svg";
import { appConfig } from "@/config";
import { testimonials } from "@/data/marketing/testimonials-data";
import { Button } from "@/components/ui/button";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const TestimonialPanel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // auto-advance testimonials every 8 seconds
    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const newProgress = (elapsedTime % 8000) / 8000;

            setProgress(newProgress);

            if (elapsedTime >= 8000) {
                setCurrentIndex((prev) => (prev + 1) % sidePanelTestimonials.length);
            }
        }, 16); // update progress every 16ms

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    const sidePanelTestimonials = testimonials.filter((t) => t.showInSidePanel);
    const currentTestimonial = sidePanelTestimonials[currentIndex];
    const currentBgImageUrl = sidePanelTestimonials[currentIndex].backgroundUrl;

    const handlePrevious = () => {
        setProgress(0);
        setCurrentIndex(
            (prev) => (prev - 1 + sidePanelTestimonials.length) % sidePanelTestimonials.length,
        );
    };

    const handleUpcoming = () => {
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % sidePanelTestimonials.length);
    };

    return (
        <div className="hidden flex-1 p-4 lg:block">
            <div
                className={`relative flex h-full flex-1 flex-col justify-between rounded-xl bg-gray-100 p-12 ${
                    currentBgImageUrl ? "text-white" : "text-black"
                }`}
                style={{
                    backgroundImage: currentBgImageUrl ? `url("${currentBgImageUrl}")` : undefined,
                    backgroundSize: "cover",
                }}
            >
                {currentBgImageUrl && (
                    <div className="absolute inset-0 rounded-xl bg-black opacity-30" />
                )}

                <div className="z-10 flex flex-col gap-8">
                    <Image
                        src={currentBgImageUrl ? QuoteWhiteImg : QuouteBlackImg}
                        alt="Quote"
                        width={48}
                        height={48}
                    />

                    <div className="flex flex-col gap-6">
                        <p className="text-lg">{currentTestimonial.content.text}</p>

                        <div className="flex flex-col gap-1">
                            <p className="font-semibold">{currentTestimonial.author.name}</p>
                            <p className="text-sm">
                                {currentTestimonial.author.role} @
                                {currentTestimonial.author.company}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="z-10 flex items-center justify-between">
                    <div className="flex gap-2">
                        {sidePanelTestimonials.map((_, index) => (
                            <div
                                key={index}
                                className={`relative h-1.5 w-8 overflow-hidden rounded-full transition-all ${
                                    currentBgImageUrl ? "bg-white/30" : "bg-black/30"
                                }`}
                            >
                                <div
                                    className={`absolute inset-0 rounded-full ${
                                        currentBgImageUrl ? "bg-white" : "bg-black"
                                    }`}
                                    style={{
                                        width:
                                            index === currentIndex
                                                ? `${progress * 100}%`
                                                : index < currentIndex
                                                  ? "100%"
                                                  : "0%",
                                        transition: "width 16ms linear",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={handlePrevious}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleUpcoming}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Layout = ({ children }: { children: ReactNode }) => {
    const { isEnabled, direction } = appConfig.testimonialSidePanel;

    return (
        <div
            className={`flex ${direction === "right" ? "flex-row" : "flex-row-reverse"} justify-center py-8 lg:h-screen lg:py-0 ${manrope.variable} font-manrope`}
        >
            {/* Left Side - Sign Up Form */}
            <div className="w-[596px] px-16">{children}</div>

            {/* Right Side - Testimonial */}
            {isEnabled && <TestimonialPanel />}
        </div>
    );
};

export default Layout;
