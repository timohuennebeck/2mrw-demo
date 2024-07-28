import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

const inter = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    // extensions similar to Grammarly, ColorZilla and LanguageTool causes a warning
    // enabling 'suppressHydrationWarning' disables this in the console

    return (
        <html className="h-full bg-white" lang="en" suppressHydrationWarning={true}>
            <body className={`h-full ${inter.className}`}>
                <Providers>
                    {children}
                </Providers>
                <Toaster position="top-left" />
            </body>
        </html>
    );
};

export default RootLayout;
