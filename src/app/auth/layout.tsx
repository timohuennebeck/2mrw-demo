import { ReactNode } from "react";
import Image from "next/image";
import { Manrope } from "next/font/google";
import QuouteBlackImg from "@/assets/quotes.svg";
import QuoteWhiteImg from "@/assets/quotes-white.svg";
import { appConfig } from "@/config";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const TestimonialPanel = ({ bgImageUrl }: { bgImageUrl: string }) => {
    return (
        <div className="hidden flex-1 p-4 lg:block">
            <div
                className={`relative flex h-full flex-1 flex-col justify-end rounded-xl bg-gray-100 p-12 ${bgImageUrl ? "text-white" : "text-black"}`}
                style={{
                    backgroundImage: bgImageUrl ? `url("${bgImageUrl}")` : undefined,
                    backgroundSize: "cover",
                }}
            >
                {bgImageUrl && <div className="absolute inset-0 rounded-xl bg-black opacity-30" />}
                <div className="z-10 flex flex-col gap-4">
                    <Image
                        src={bgImageUrl ? QuoteWhiteImg : QuouteBlackImg}
                        alt="Quote"
                        width={48}
                        height={48}
                    />

                    <p>
                        "Lorem,y ipsum dolor sit amet consectetur adipisicing elit. Magnam ipsam nam
                        ab quam quidem! Voluptate at, totam doloribus quaerat facilis explicabo
                        aliquam eos rem sint accusamus possimus sit ex suscipit!"
                    </p>

                    <div className="flex flex-col gap-1">
                        <p className="font-semibold">Lorem, ipsum dolor.</p>
                        <p className="text-sm">UX Researcher Intern - Youtube</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Layout = ({ children }: { children: ReactNode }) => {
    const { backgroundEnabled, backgroundUrl } = appConfig.auth.sidePanel;

    return (
        <div
            className={`flex justify-center py-8 lg:h-screen lg:py-0 ${manrope.variable} font-manrope`}
        >
            {/* Left Side - Sign Up Form */}
            <div className="w-[596px] px-16">{children}</div>

            {/* Right Side - Testimonial */}
            {backgroundEnabled && <TestimonialPanel bgImageUrl={backgroundUrl} />}
        </div>
    );
};

export default Layout;
