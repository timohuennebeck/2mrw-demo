import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import TestimonialRating from "./TestimonialRating";

const DemoSection = () => {
    return (
        <section className="mt-12 flex flex-col items-center justify-center px-4 py-20 text-center">
            {/* Main Title */}
            <h1 className="mb-6 max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                Experience 2mrw <span className="text-gray-400">in 2 minutes</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-10 max-w-4xl text-lg text-gray-600">
                Launch in as little as 48 hours with this lightweight Next.js Supabase boilerplate
                that handles all the boring stuff such user authentication, stripe, etc.
            </p>

            {/* Demo Image */}
            <div className="relative w-full max-w-5xl">
                <video
                    src="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-2xl"
                    autoPlay
                    muted
                    loop
                />
            </div>
        </section>
    );
};

export default DemoSection;
