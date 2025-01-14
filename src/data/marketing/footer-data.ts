export type FooterLink = {
    name: string;
    href: string;
};

export type FooterLinks = {
    solutions: FooterLink[];
    support: FooterLink[];
    product: FooterLink[];
};

export const footerLinks: FooterLinks = {
    solutions: [
        { name: "Lorem ipsum", href: "/lorem" },
        { name: "Dolor sit", href: "/dolor" },
        { name: "Amet consectetur", href: "/amet" },
        { name: "Adipiscing elit", href: "/adipiscing" },
        { name: "Sed do", href: "/sed" },
    ],
    support: [
        { name: "Eiusmod tempor", href: "/tempor" },
        { name: "Incididunt ut", href: "/incididunt" },
        { name: "Labore et", href: "/labore" },
    ],
    product: [
        { name: "Dolore magna", href: "/dolore" },
        { name: "Aliqua ut", href: "/aliqua" },
        { name: "Enim ad", href: "/enim" },
        { name: "Minim veniam", href: "/minim" },
    ],
};

export const bottomLinks: FooterLink[] = [
    { name: "Ut aliquip ex", href: "/aliquip" },
    { name: "Commodo consequat", href: "/commodo" },
];
