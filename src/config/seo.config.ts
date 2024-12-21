/**
 * - default: default seo config for the entire site
 * - pages: seo config for individual pages
 */

import { CardType, SEOConfig } from "@/interfaces/models/seo";
import { ROUTES_CONFIG } from "./routes.config";

/**
 * sitemap priority guidelines:
 *
 * 1.0  HIGHEST   homepage only
 * 0.8  HIGH      primary pages (features, pricing, main marketing)
 * 0.6  MEDIUM    secondary pages (blog posts, documentation)
 * 0.4  LOW       support pages (about, contact, auth)
 * 0.2  LOWEST    utility pages (terms, privacy, sitemap)

 * FYI: Lower priority !== less important. It indicates pages that are
 * further from the main customer journey or conversion goals.
 */

export enum SitemapPriority {
    HIGHEST = 1.0,
    HIGH = 0.8,
    MEDIUM = 0.6,
    LOW = 0.4,
    LOWEST = 0.2,
}

/**
 * Change Frequency Guidelines:
 * - YEARLY:     rarely updated (legal, auth)
 * - MONTHLY:    marketing pages
 * - WEEKLY:     active content (blog, docs)
 * - DAILY:      news, frequently updated content
 */

export enum ChangeFrequency {
    YEARLY = "yearly",
    MONTHLY = "monthly",
    WEEKLY = "weekly",
    DAILY = "daily",
}

export const seoConfig: SEOConfig = {
    default: {
        title: "Lightweight SaaS Boilerplate • 2mrw",
        template: "%s • 2mrw", // used for page-specific titles: "Sign In • 2mrw"
        description:
            "Launch your SaaS faster with our Next.js and Supabase boilerplate.",
        keywords: ["SaaS boilerplate", "Next.js template", "Supabase starter"],
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://2mrw.dev",
        locale: "en-US",

        // open graph image (used by Facebook, LinkedIn, etc.)
        ogImage: {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "2mrw SaaS Boilerplate",
        },

        // twitter config (used by Twitter)
        twitter: {
            handle: "@timohuennebeck",
            site: "@joinforj",
            cardType: CardType.SUMMARY_LARGE_IMAGE,
        },
    },

    pages: {
        /**
         * the following routes are (public) pages that should be indexed by search engines
         * these are typically pages that are accessible to all users
         */

        public: [
            {
                path: ROUTES_CONFIG.PUBLIC.LANDING_PAGE,
                changefreq: ChangeFrequency.MONTHLY, // how often the page content updates
                priority: SitemapPriority.HIGHEST, // how important the page is relative to other pages on the site
            },
            {
                path: ROUTES_CONFIG.SIGN_IN,
                changefreq: ChangeFrequency.YEARLY,
                priority: SitemapPriority.LOW,
            },
            {
                path: ROUTES_CONFIG.SIGN_UP,
                changefreq: ChangeFrequency.YEARLY,
                priority: SitemapPriority.LOW,
            },
        ],

        /**
         * the following routes are (protected) pages that should not be indexed by search engines
         * these are typically pages that are only accessible to authenticated users
         */

        protected: [
            ...Object.values(ROUTES_CONFIG.PROTECTED),

            // auth handlers
            ROUTES_CONFIG.CONFIRM,
            ROUTES_CONFIG.CALLBACK,

            // utility auth routes
            ROUTES_CONFIG.FORGOT_PASSWORD,
            ROUTES_CONFIG.UPDATE_PASSWORD,

            // status pages
            ROUTES_CONFIG.PUBLIC.STATUS_ERROR,
            ROUTES_CONFIG.PUBLIC.STATUS_SUCCESS,

            "/api/*",
        ],
    },
};
