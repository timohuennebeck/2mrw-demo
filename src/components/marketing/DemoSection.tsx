import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import TestimonialRating from "./TestimonialRating";

interface DemoSectionProps {
    title: string;
    highlightedTitle?: string;
    subtitle: string;
    videoUrl: string;
}

const DemoSection = ({ 
    title, 
    highlightedTitle, 
    subtitle, 
    videoUrl 
}: DemoSectionProps) => {
    return (
        <div className="flex flex-col items-center justify-center text-center gap-10">
            {/* Main Title */}
            <h1 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                {title} {highlightedTitle && <span className="text-gray-400">{highlightedTitle}</span>}
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl text-lg text-gray-600">
                {subtitle}
            </p>

            {/* Demo Video */}
            <div className="relative w-full max-w-5xl">
                <video
                    src={videoUrl}
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-2xl"
                    autoPlay
                    muted
                    loop
                />
            </div>
        </div>
    );
};

export default DemoSection;
