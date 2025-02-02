"use client";

import { handleSmoothScroll } from "@/utils/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import ThemeToggle from "../ui/theme-toggle";

interface NavItem {
    href: string;
    label: string;
    isExternal?: boolean;
}

interface HeaderParams {
    navItems: NavItem[];
    logoSrc: string;
    loginOnClick: () => void;
    userIsLoggedIn: boolean;
}

const Header = ({ navItems, logoSrc, loginOnClick, userIsLoggedIn }: HeaderParams) => {
    const router = useRouter();

    return (
        <header>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="w-32">
                    <Link href="/" className="flex items-center">
                        <Image
                            src={logoSrc}
                            alt="logo"
                            width={32}
                            height={32}
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleSmoothScroll(e, item.href)}
                            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            {...(item.isExternal && {
                                target: "_blank",
                                rel: "noopener noreferrer",
                            })}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <ThemeToggle />
                </nav>

                {/* Login Button */}
                <div className="w-32 text-right">
                    <Button
                        variant="ghost"
                        onClick={userIsLoggedIn ? () => router.push("/app") : loginOnClick}
                    >
                        {userIsLoggedIn ? (
                            <>
                                Dashboard
                                <ArrowRight size={16} className="text-gray-400" />
                            </>
                        ) : (
                            <>
                                Log in
                                <ArrowRight size={16} className="text-gray-400" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
