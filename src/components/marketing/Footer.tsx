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
        <footer className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Top section with logo and description */}
                <div className="mb-8">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="h-8 w-auto"
                        />
                    </Link>
                    <p className="mt-4 max-w-2xl text-sm text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ea
                        obcaecati, veniam veritatis accusamus corporis nesciunt nihil iste dicta
                        sequi!
                    </p>
                </div>

                {/* Separator */}
                <div className="h-px bg-gray-200" />

                {/* Main links section */}
                <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
                    {/* Links Columns */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Solutions</h3>
                        <ul className="mt-6 space-y-4">
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
                        <h3 className="text-sm font-semibold text-gray-900">Support</h3>
                        <ul className="mt-6 space-y-4">
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
                        <h3 className="text-sm font-semibold text-gray-900">2mrw</h3>
                        <ul className="mt-6 space-y-4">
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
                        <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                        <ul className="mt-6 space-y-4">
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

                {/* Separator */}
                <div className="h-px bg-gray-200" />

                {/* Bottom section with copyright */}
                <div className="flex items-center justify-between pt-8">
                    <p className="text-sm text-gray-600">© 2024 2mrw, Inc. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                            Terms and Conditions
                        </Link>
                        <Link
                            href="/changelog"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Changelog
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
