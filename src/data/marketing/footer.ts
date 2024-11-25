export type FooterLink = {
    name: string;
    href: string;
};

export type FooterLinks = {
    solutions: FooterLink[];
    support: FooterLink[];
    company: FooterLink[];
    legal: FooterLink[];
};

export const footerLinks: FooterLinks = {
    solutions: [
        { name: "Marketing", href: "/marketing" },
        { name: "Analytics", href: "/analytics" },
        { name: "Automation", href: "/automation" },
        { name: "Commerce", href: "/commerce" },
        { name: "Insights", href: "/insights" },
    ],
    support: [
        { name: "Submit ticket", href: "/support" },
        { name: "Documentation", href: "/docs" },
        { name: "Guides", href: "/guides" },
    ],
    company: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Jobs", href: "/jobs" },
        { name: "Press", href: "/press" },
    ],
    legal: [
        { name: "Terms of service", href: "/terms" },
        { name: "Privacy policy", href: "/privacy" },
        { name: "License", href: "/license" },
    ],
};

export const bottomLinks: FooterLink[] = [
    { name: "Terms and Conditions", href: "/privacy" },
    { name: "Changelog", href: "/changelog" },
];
