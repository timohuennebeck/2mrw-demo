"use client";

import BugReportWidget from "@/components/application/BugReportWidget";
import FeedbackWidget from "@/components/application/FeedbackWidget";
import AppSidebar from "@/components/ui/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { appConfig } from "@/config";
import { usePathname } from "next/navigation";
import React from "react";

const TopBar = () => {
    const pathname = usePathname();

    const breadcrumbs = pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, array) => {
            const href = "/" + array.slice(0, index + 1).join("/");
            // convert kebab-case to Title Case
            const label = segment
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return {
                href,
                label,
                isLast: index === array.length - 1,
            };
        });

    return (
        <div className="flex items-center gap-4 px-4 py-4">
            <SidebarTrigger />

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/app">Home</BreadcrumbLink>
                    </BreadcrumbItem>

                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={breadcrumb.href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {breadcrumb.isLast ? (
                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={breadcrumb.href}>
                                        {breadcrumb.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />

                <SidebarInset>
                    <main className="flex h-full flex-col">
                        <TopBar />

                        <div className="h-full overflow-y-auto px-8 py-8">{children}</div>
                    </main>
                </SidebarInset>
            </div>

            <div className="fixed bottom-4 right-4 flex gap-2">
                {appConfig.feedback.widgets.reportBug.isEnabled && <BugReportWidget />}
                {appConfig.feedback.widgets.shareFeedback.isEnabled && <FeedbackWidget />}
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
