"use client";

import BugReportWidget from "@/components/application/bug-report-widget";
import FeedbackWidget from "@/components/application/feedback-widget";
import AppSidebar from "@/components/ui/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { appConfig } from "@/config";
import { ChevronLeft, X } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    const [widgetsVisible, setWidgetsVisible] = useState(true);
    const [showToggle, setShowToggle] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("feedbackWidgetsVisible");
            if (stored !== null) {
                setWidgetsVisible(stored === "true");
            }
        }
    }, []);

    const toggleWidgets = () => {
        const newValue = !widgetsVisible;
        setWidgetsVisible(newValue);
        if (typeof window !== "undefined") {
            localStorage.setItem("feedbackWidgetsVisible", String(newValue));
        }
    };

    return (
        <SidebarProvider defaultOpen>
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />

                <SidebarInset>
                    <main className="flex h-full flex-col">
                        <TopBar />

                        <div className="h-full overflow-y-auto px-8 py-8">{children}</div>
                    </main>
                </SidebarInset>
            </div>

            {/* Feedback Widgets */}
            <div className="fixed bottom-4 right-8 flex items-center gap-2">
                {widgetsVisible ? (
                    <>
                        <div
                            className="flex items-center gap-2"
                            onMouseEnter={() => setShowToggle(true)}
                            onMouseLeave={() => setShowToggle(false)}
                        >
                            {showToggle && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleWidgets}
                                    className="h-8 w-8 bg-white shadow-sm"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                            {appConfig.feedback.widgets.reportBug.isEnabled && <BugReportWidget />}
                            {appConfig.feedback.widgets.shareFeedback.isEnabled && (
                                <FeedbackWidget />
                            )}
                        </div>
                    </>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleWidgets}
                        className="h-8 w-8 bg-white shadow-sm"
                        title="Show feedback widgets"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
