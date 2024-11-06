"use client";

import React from "react";
import LeftNavigationBar from "@/components/LeftNavigationBar";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
        <div className="flex h-screen overflow-hidden">
            <LeftNavigationBar />
            <div className="h-full flex-1 p-2 pl-0">
                <main className="h-full overflow-scroll rounded-lg border border-neutral-200 bg-white p-6 scrollbar-hide">
                    <div className="mb-4 flex items-center space-x-2 text-sm text-gray-500">
                        <Link
                            href="/"
                            className="font-medium text-neutral-500 hover:text-neutral-800"
                        >
                            Home
                        </Link>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <React.Fragment key={breadcrumb.href}>
                                <ChevronRight size={16} />
                                <Link
                                    href={breadcrumb.href}
                                    className={`font-medium ${
                                        index === breadcrumbs.length - 1
                                            ? "text-neutral-800"
                                            : "text-neutral-500 hover:text-neutral-800"
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
