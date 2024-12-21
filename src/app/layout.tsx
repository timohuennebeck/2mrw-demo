import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { generateSEOTags } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateSEOTags({});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html className="h-full" lang="en" suppressHydrationWarning>
            <body className={`h-full ${inter.className}`}>
                <Providers>
                    {children}
                </Providers>

                <Toaster position="top-right" expand closeButton />
            </body>
        </html>
    );
};

export default RootLayout;
