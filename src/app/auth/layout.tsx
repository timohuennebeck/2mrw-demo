import TestimonialPanel from "@/components/application/testimonials-panel";
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
        /**
         * - uses either flex-row or flex-row-reverse to change the position of the TestimonialPanel
         * - this can be changed inside the app.config.ts file
         */

        <div
            className={`flex ${direction === "right" ? "flex-row" : "flex-row-reverse"} justify-center py-8 h-screen lg:py-0 ${manrope.variable} font-manrope dark:bg-black`}
        >
            {/* Left Side - Sign Up Form */}
            <div className="w-[596px] px-16 dark:bg-black">{children}</div>

            {/* Right Side - Testimonial */}
            {isEnabled && <TestimonialPanel />}
        </div>
    );
};

export default Layout;
