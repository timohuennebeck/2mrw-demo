import { FooterLink, FooterLinks } from "@/data/marketing/footer-data";
import { handleSmoothScroll } from "@/utils/navigation";
import Image from "next/image";
import Link from "next/link";

interface FooterParams {
    links: FooterLinks;
    logo: {
        src: string;
        alt: string;
    };
    description: string;
    companyName: string;
    bottomLinks: FooterLink[];
}

const FooterLogo = ({ logo }: { logo: FooterParams["logo"] }) => (
    <Link href="/" className="flex items-center">
        <Image src={logo.src} alt={logo.alt} width={32} height={32} className="h-8 w-auto" />
    </Link>
);

const Separator = () => <div className="h-px bg-gray-200" />;

const FooterLinkSection = ({ title, links }: { title: string; links: FooterLink[] }) => (
    <div className="flex flex-col gap-6">
        <h3 className="text-sm font-semibold text-foreground">
            {title.charAt(0).toUpperCase() + title.slice(1)}
        </h3>
        <ul className="flex flex-col gap-4">
            {links.map((link) => (
                <li key={link.name}>
                    <Link
                        href={link.href}
                        onClick={(e) => !link.isExternal && handleSmoothScroll(e, link.href)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                        {...(link.isExternal && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                        })}
                    >
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const FooterBottom = ({
    companyName,
    bottomLinks,
}: {
    companyName: string;
    bottomLinks: FooterLink[];
}) => (
    <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {companyName}, Inc. All rights reserved.
        </p>
        <div className="flex space-x-6">
            {bottomLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    {link.name}
                </Link>
            ))}
        </div>
    </div>
);

const Footer = ({ links, logo, description, companyName, bottomLinks }: FooterParams) => {
    return (
        <footer className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <FooterLogo logo={logo} />
                <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {Object.entries(links).map(([section, sectionLinks]) => (
                    <FooterLinkSection key={section} title={section} links={sectionLinks} />
                ))}
            </div>

            <Separator />

            <FooterBottom companyName={companyName} bottomLinks={bottomLinks} />
        </footer>
    );
};

export default Footer;
