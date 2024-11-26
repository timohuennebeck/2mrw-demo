import Image from "next/image";
import Link from "next/link";

// Define types for the footer props
type FooterLink = {
    name: string;
    href: string;
};

type FooterLinks = {
    solutions: FooterLink[];
    support: FooterLink[];
    product: FooterLink[];
    legal: FooterLink[];
};

type FooterProps = {
    links: FooterLinks;
    logo: {
        src: string;
        alt: string;
    };
    description: string;
    companyName: string;
    bottomLinks: FooterLink[];
};

const Footer = ({
    links,
    logo,
    description,
    companyName,
    bottomLinks,
}: FooterProps) => {
    return (
        <footer className="flex flex-col gap-8">
            {/* Top section with logo and description */}
            <div className="flex flex-col gap-4">
                <Link href="/" className="flex items-center">
                    <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>
                <p className="max-w-2xl text-sm text-gray-600">
                    {description}
                </p>
            </div>

            {/* Separator */}
            <div className="h-px bg-gray-200" />

            {/* Main links section */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {Object.entries(links).map(([section, sectionLinks]) => (
                    <div key={section} className="flex flex-col gap-6">
                        <h3 className="text-sm font-semibold text-gray-900">
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </h3>
                        <ul className="flex flex-col gap-4">
                            {sectionLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Separator */}
            <div className="h-px bg-gray-200" />

            {/* Bottom section with copyright */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} {companyName}, Inc. All rights reserved.
                </p>
                <div className="flex space-x-6">
                    {bottomLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
