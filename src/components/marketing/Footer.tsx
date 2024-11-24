import Image from "next/image";
import Link from "next/link";

const footerLinks = {
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

const Footer = () => {
    return (
        <footer>
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
                    {/* Logo Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="text-sm font-medium">Solutions</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.solutions.map((link) => (
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

                    <div>
                        <h3 className="text-sm font-medium">Support</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.support.map((link) => (
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

                    <div>
                        <h3 className="text-sm font-medium">2mrw</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.company.map((link) => (
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

                    <div>
                        <h3 className="text-sm font-medium">Legal</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.legal.map((link) => (
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
                </div>
            </div>
        </footer>
    );
};

export default Footer;
