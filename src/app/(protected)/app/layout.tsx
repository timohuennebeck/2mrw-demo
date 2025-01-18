"use client";

import BugReportWidget from "@/components/application/bug-report-widget";
import FeedbackWidget from "@/components/application/feedback-widget";
import { OnboardingChecklistTrigger } from "@/components/application/onboarding/onboarding-checklist-trigger";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/ui/user-dropdown";
import { appConfig, onboardingConfig } from "@/config";
import { cn } from "@/lib/utils";
import { ChevronLeft, CreditCard, LayoutGrid, Sparkles, User2, Share2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

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

    const mainNavItems = [
        {
            href: "/app",
            label: "Home",
            icon: LayoutGrid,
        },
        {
            href: "/app/user-profile",
            label: "Profile",
            icon: User2,
        },
    ];

    const userDropdownItems = [
        {
            label: "Billing",
            href: "/app/billing",
            icon: CreditCard,
        },
        {
            label: "Invite a Friend",
            href: "/app/refer",
            icon: Share2,
        },
        {
            label: "Upgrade to Premium",
            href: "/choose-pricing-plan",
            icon: Sparkles,
        },
    ];

    return (
        <div className="min-h-screen bg-white">
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
            <div className="mx-auto max-w-5xl p-6">
                <div className="mb-12 mt-6 flex justify-start">
                    <UserDropdown
                        user={{
                            name: "Timo Huennebeck",
                            email: "user@example.com",
                            initials: "TH",
                        }}
                        menuItems={userDropdownItems}
                        onLogout={() => {
                            // Add your logout logic here
                        }}
                    />
                </div>

                <nav className="mb-8">
                    <ul className="flex gap-2">
                        {mainNavItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 active:bg-gray-100",
                                        ((item.href === "/app" && pathname === "/app") ||
                                            (item.href !== "/app" &&
                                                pathname.startsWith(item.href))) &&
                                            "bg-gray-100",
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <OnboardingChecklistTrigger
                    userProgress={{ uploadedProductDemos: 0, referralCount: 0 }}
                    config={onboardingConfig}
                />

                {children}
            </div>
        </div>
    );
}
