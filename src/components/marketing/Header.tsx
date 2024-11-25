import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
}

interface HeaderProps {
    navItems?: NavItem[];
    logoSrc?: string;
    logoAlt?: string;
    loginHref?: string;
}

const defaultNavItems: NavItem[] = [
    { href: '/product', label: 'Product' },
    { href: '/features', label: 'Features' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/company', label: 'Company' },
];

const Header = ({
    navItems = defaultNavItems,
    logoSrc = "https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg",
    logoAlt = "Logo",
    loginHref = "/login"
}: HeaderProps) => {
    return (
        <header className="bg-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src={logoSrc}
                        alt={logoAlt}
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Login Button */}
                <Link
                    href={loginHref}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                    Log in
                    <ArrowRight size={16} className="text-gray-400" />
                </Link>
            </div>
        </header>
    );
};

export default Header;
