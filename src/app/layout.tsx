import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { generateSEOTags } from "@/lib/seo";
import Script from "next/script";
import { appConfig } from "@/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateSEOTags({});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html className="h-full" lang="en" suppressHydrationWarning>
            <body className={`h-full ${inter.className}`}>
                {appConfig.customerSupport.isEnabled && (
                    <Script id="crisp-script" strategy="afterInteractive">
                        {`window.$crisp=[];window.CRISP_WEBSITE_ID="${appConfig.customerSupport.websiteId}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
                    </Script>
                )}

                <Providers>
                    {children}
                </Providers>

                <Toaster position="top-right" expand closeButton />
            </body>
        </html>
    );
};

export default RootLayout;
