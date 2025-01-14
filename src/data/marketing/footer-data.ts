export type FooterLink = {
    name: string;
    href: string;
    isExternal?: boolean;
};

export type FooterLinks = {
    product: FooterLink[];
    support: FooterLink[];
};

export const footerLinks: FooterLinks = {
    product: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "FAQ", href: "#faq" },
        {
            name: "Documentation",
            href: "https://docs.2mrw.dev",
            isExternal: true,
        },
    ],
    support: [
        {
            name: "Help Center",
            href: "https://help.example.com",
            isExternal: true,
        },
        {
            name: "Contact",
            href: "mailto:support@example.com",
            isExternal: true,
        },
    ],
};

export const bottomLinks: FooterLink[] = [
    { name: "Privacy Policy", href: "/privacy", isExternal: true },
    { name: "Terms of Service", href: "/terms", isExternal: true },
];
