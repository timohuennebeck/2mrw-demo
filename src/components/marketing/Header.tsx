import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const Header = () => {
    return (
        <header className="bg-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/product" className="text-sm text-gray-600 hover:text-gray-900">
                        Product
                    </Link>
                    <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">
                        Features
                    </Link>
                    <Link href="/marketplace" className="text-sm text-gray-600 hover:text-gray-900">
                        Marketplace
                    </Link>
                    <Link href="/company" className="text-sm text-gray-600 hover:text-gray-900">
                        Company
                    </Link>
                </nav>

                {/* Login Button */}
                <Link
                    href="/login"
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
