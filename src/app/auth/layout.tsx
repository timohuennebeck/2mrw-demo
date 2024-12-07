import { ReactNode } from "react";
import QuoteImg from "@/assets/quotes.svg";
import Image from "next/image";
import { Manrope } from "next/font/google";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className={`flex h-screen ${manrope.variable} font-manrope`}>
            {/* Left Side - Sign Up Form */}
            <div className="w-5/12 px-12">{children}</div>

            {/* Right Side - Testimonial */}
            <div className="flex-1 p-4">
                <div className="flex h-full flex-1 flex-col justify-end rounded-xl bg-gray-100 p-12">
                    <div className="flex flex-col gap-4">
                        <Image src={QuoteImg} alt="Quote" width={48} height={48} />

                        <p>
                            "Lorem,y ipsum dolor sit amet consectetur adipisicing elit. Magnam ipsam
                            nam ab quam quidem! Voluptate at, totam doloribus quaerat facilis
                            explicabo aliquam eos rem sint accusamus possimus sit ex suscipit!"
                        </p>

                        <div className="flex flex-col gap-1">
                            <p className="font-semibold">Lorem, ipsum dolor.</p>
                            <p className="text-sm">UX Researcher Intern - Youtube</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
