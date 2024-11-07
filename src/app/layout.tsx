import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Boilerplate",
    description: "Created by Timo Huennebeck",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html className="h-full" lang="en" suppressHydrationWarning={true}>
            <body className={`h-full`} suppressHydrationWarning={true}>
                <Providers>
                    {children}
                </Providers>

                <Toaster position="top-right" />
            </body>
        </html>
    );
};

export default RootLayout;
