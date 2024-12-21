import TestimonialPanel from "@/components/application/TestimonialPanel";
import { appConfig } from "@/config";
import { Manrope } from "next/font/google";
import { ReactNode } from "react";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

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
