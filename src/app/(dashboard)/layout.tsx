"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LeftNavigationBar from "@/components/ui/LeftNavigationBar/LeftNavigationBar";

const _generateBreadcrumbs = (pathname: string) => {
    const paths = pathname.split("/").filter((path) => path);
    return paths.map((path, index) => ({
        label: path
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" "),
        href: "/" + paths.slice(0, index + 1).join("/"),
    }));
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const breadcrumbs = _generateBreadcrumbs(pathname);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <LeftNavigationBar />
            <div className="h-full flex-1 p-2 pl-0">
                <main className="h-full overflow-scroll rounded-lg border border-gray-200 bg-white p-6 shadow-sm scrollbar-hide">
                    <div className="mb-4 flex items-center space-x-2 text-sm text-gray-500">
                        <Link href="/" className="font-medium text-gray-500 hover:text-gray-800">
                            Home
                        </Link>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <React.Fragment key={breadcrumb.href}>
                                <ChevronRight size={16} />
                                <Link
                                    href={breadcrumb.href}
                                    className={`font-medium ${
                                        index === breadcrumbs.length - 1
                                            ? "text-gray-800"
                                            : "text-gray-500 hover:text-gray-800"
                                    }`}
                                >
                                    {breadcrumb.label}
                                </Link>
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="pl-2">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
