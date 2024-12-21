export const seoConfig = {
    default: {
        title: "2mrw SaaS Boilerplate",
        template: "%s | 2mrw",
        description:
            "Launch your SaaS faster with our Next.js and Supabase boilerplate.",
        keywords: ["SaaS boilerplate", "Next.js template", "Supabase starter"],
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://2mrw.dev",
        twitter: {
            handle: "@timohuennebeck",
            site: "@joinforj",
        },
    },
    pages: {
        public: [
            {
                path: "/",
                priority: 1.0,
                changefreq: "yearly",
            },
            {
                path: "/pricing",
                priority: 0.8,
                changefreq: "monthly",
            },
        ],
        protected: [
            "/app",
            "/auth",
            "/api",
            "/onboarding",
        ],
    },
};
