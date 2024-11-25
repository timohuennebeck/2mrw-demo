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
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
                {/* Top section with logo and description */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="h-8 w-auto"
                        />
                    </Link>
                    <p className="max-w-2xl text-sm text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ea
                        obcaecati, veniam veritatis accusamus corporis nesciunt nihil iste dicta
                        sequi!
                    </p>
                </div>

                {/* Separator */}
                <div className="h-px bg-gray-200" />

                {/* Main links section */}
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {/* Solutions Column */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-semibold text-gray-900">Solutions</h3>
                        <ul className="flex flex-col gap-4">
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

                    {/* Support Column */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-semibold text-gray-900">Support</h3>
                        <ul className="flex flex-col gap-4">
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

                    {/* Company Column */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-semibold text-gray-900">2mrw</h3>
                        <ul className="flex flex-col gap-4">
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

                    {/* Legal Column */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                        <ul className="flex flex-col gap-4">
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
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">© 2024 2mrw, Inc. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                            Terms and Conditions
                        </Link>
                        <Link href="/changelog" className="text-sm text-gray-600 hover:text-gray-900">
                            Changelog
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
