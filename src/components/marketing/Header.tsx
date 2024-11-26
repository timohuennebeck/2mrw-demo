"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    isExternal?: boolean;
}

interface HeaderProps {
    navItems?: NavItem[];
    logoSrc?: string;
    logoAlt?: string;
    loginHref?: string;
}

const Header = ({ navItems = [], logoSrc, logoAlt, loginHref }: HeaderProps) => {
    const handleClick = (e: React.MouseEvent, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src={logoSrc ?? ""}
                        alt={logoAlt ?? ""}
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleClick(e, item.href)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                            {...(item.isExternal && {
                                target: "_blank",
                                rel: "noopener noreferrer",
                            })}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Login Button */}
                <Link
                    href={loginHref ?? ""}
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
