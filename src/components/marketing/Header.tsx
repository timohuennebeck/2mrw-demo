"use client";

import { handleSmoothScroll } from "@/utils/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface NavItem {
    href: string;
    label: string;
    isExternal?: boolean;
}

interface HeaderParams {
    navItems: NavItem[];
    logoSrc: string;
    loginOnClick: () => void;
}

const Header = ({ navItems, logoSrc, loginOnClick }: HeaderParams) => {
    return (
        <header>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image src={logoSrc} alt="logo" width={32} height={32} className="h-8 w-auto" />
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleSmoothScroll(e, item.href)}
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
                <Button variant="ghost" onClick={loginOnClick}>
                    Log in
                    <ArrowRight size={16} className="text-gray-400" />
                </Button>
            </div>
        </header>
    );
};

export default Header;
