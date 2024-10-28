import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Boilerplate",
    description: "Created bY Timo Huennebeck",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    // extensions similar to Grammarly, ColorZilla and LanguageTool causes a warning
    // enabling 'suppressHydrationWarning' disables this in the console

    return (
        <html className="h-full" lang="en" suppressHydrationWarning={true}>
            <body className={`h-full`}>
                <Providers>{children}</Providers>
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
};

export default RootLayout;
