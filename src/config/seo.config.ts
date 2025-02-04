/**
 * - default: default seo config for the entire site
 * - pages: seo config for individual pages
 */

import { CardType, SEOConfig } from "@/interfaces/models/seo.model";
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
        title: "YOUR_TITLE • YOUR_COMPANY_NAME",
        template: "%s • YOUR_COMPANY_NAME", // used for page-specific titles: "Sign In • 2mrw"
        description: "YOUR_DESCRIPTION",
        keywords: ["YOUR_KEYWORDS"],
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://YOUR_COMPANY_NAME.com",
        locale: "en-US",

        // open graph image (used by Facebook, LinkedIn, etc.)
        ogImage: {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "YOUR_COMPANY_NAME",
        },

        // twitter config (used by Twitter)
        twitter: {
            handle: "@YOUR_TWITTER_HANDLE",
            site: "@YOUR_COMPANY_TWITTER_HANDLE",
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
                path: ROUTES_CONFIG.AUTH.SIGN_IN,
                changefreq: ChangeFrequency.YEARLY,
                priority: SitemapPriority.LOW,
            },
            {
                path: ROUTES_CONFIG.AUTH.SIGN_UP,
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
            ROUTES_CONFIG.AUTH.CONFIRM,
            ROUTES_CONFIG.AUTH.CALLBACK,

            // utility auth routes
            ROUTES_CONFIG.AUTH.FORGOT_PASSWORD,
            ROUTES_CONFIG.AUTH.UPDATE_PASSWORD,

            // status pages
            ROUTES_CONFIG.PUBLIC.STATUS_ERROR,
            ROUTES_CONFIG.PUBLIC.STATUS_SUCCESS,

            "/api/*",
        ],
    },
};
