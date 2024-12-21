import { ChangeFrequency, seoConfig, SitemapPriority } from "@/config";
import { MetadataRoute } from "next";

/**
 * generates sitemap.xml
 * helps search engines understand your site structure, only include public pages that should be indexed
 */

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = seoConfig.default.url;

    const publicRoutes = seoConfig.pages.public.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changefreq as ChangeFrequency,
        priority: route.priority as SitemapPriority,
    }));

    return publicRoutes;
}
