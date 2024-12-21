import { seoConfig } from "@/config";
import { Metadata } from "next";

/**
 * description:
 * - title: the title of the page, e.g. "Home • 2mrw"
 * - description: the description of the page, e.g. "Launch a SaaS in 48 hours with our next.js and supabase boilerplate."
 * - path: the path of the page, e.g. "/choose-pricing-plan"
 * - noIndex: whether the page should be indexed by search engines, e.g. false
 */

interface GenerateSEOProps {
    title?: string;
    description?: string;
    path?: string;
    keywords?: string[];
    noIndex?: boolean;
}

/**
 * generates SEO metadata for pages where generateSEOTags is called
 * used in page components to set meta tags, titles, and social sharing info
 */

export function generateSEOTags({
    title,
    description,
    path = "/",
    keywords,
    noIndex = false,
}: GenerateSEOProps = {}): Metadata {
    const config = seoConfig.default;
    const url = `${config.url}${path}`;

    return {
        title: {
            default: title ?? config.title,
            template: config.template,
        },

        description: description ?? config.description,
        keywords: keywords ?? config.keywords,

        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
            },
        },

        openGraph: {
            title: title ?? config.title,
            description: description ?? config.description,
            type: "website",
            siteName: config.title,
            url,
            locale: config.locale,
            images: [config.ogImage],
        },

        twitter: {
            card: config.twitter.cardType,
            site: config.twitter.site,
            creator: config.twitter.handle,
        },

        alternates: {
            canonical: `${config.url}${path}`,
        },

        metadataBase: new URL(config.url),
    };
}
