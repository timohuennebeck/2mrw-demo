import { MetadataRoute } from "next";
import { seoConfig } from "@/config";

/**
 * generates robots.txt configuration
 * controls how search engine crawlers should interact with your pages
 */

export default function robots(): MetadataRoute.Robots {
    const baseUrl = seoConfig.default.url;

    return {
        rules: {
            userAgent: "*", // applies to all search engine crawlers
            allow: "/", // allows crawling of the root page
            disallow: seoConfig.pages.protected, // prevents crawling of specific pages. In this case, protected pages
        },
        sitemap: `${baseUrl}/sitemap.xml`, // location of the sitemap.xml file
    };
}
