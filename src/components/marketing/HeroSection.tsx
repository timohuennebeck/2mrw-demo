import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import TestimonialRating from "./TestimonialRating";

const HeroSection = () => {
    return (
        <section className="mt-12 flex flex-col items-center justify-center px-4 py-20 text-center">
            {/* Promotional Banner */}
            <div className="mb-8 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                GET €30 OFF - 50 CODES LEFT
            </div>

            {/* Main Title */}
            <h1 className="mb-6 max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                Build Your MVP in a <span className="text-black">WEEKEND</span>, not Months, with{" "}
                <span className="text-gray-400">Next.js and Supabase</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-10 max-w-2xl text-lg text-gray-600">
                Launch in as little as 48 hours with this lightweight Next.js Supabase boilerplate
                that handles all the boring stuff such user authentication, stripe, etc.
            </p>

            {/* CTA Buttons */}
            <div className="mb-16 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <Link
                    href="/get-started"
                    className="rounded-md bg-black px-6 py-2.5 text-white transition-colors hover:bg-gray-800"
                >
                    Get Started Now
                </Link>
                <button className="flex items-center justify-center gap-2 rounded-md bg-gray-100 px-6 py-2.5 transition-colors hover:bg-gray-200">
                    <Play size={16} className="fill-current" />
                    Watch Demo
                </button>
            </div>

            <TestimonialRating />

            {/* Demo Image */}
            <div className="relative w-full max-w-5xl">
                <Image
                    src="/demo-screenshot.png"
                    alt="Product demo screenshot"
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-2xl"
                />
            </div>
        </section>
    );
};

export default HeroSection;
