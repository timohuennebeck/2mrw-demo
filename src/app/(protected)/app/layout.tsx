"use client";

import { OnboardingChecklistTrigger } from "@/components/application/onboarding/onboarding-checklist-trigger";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/ui/user-dropdown";
import { onboardingConfig } from "@/config";
import { useUser } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { createClient } from "@/services/supabase-clients/client";
import { ChevronLeft, CreditCard, LayoutGrid, Share2, Sparkles, User2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const _claimBonus = async (userId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("users")
        .update({
            onboarding_completed: true,
        })
        .eq("id", userId)
        .select();

    return { data, error };
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { dbUser, invalidateUser } = useUser();

    const supabase = createClient();

    const pathname = usePathname();

    const [widgetsVisible, setWidgetsVisible] = useState(true);
    const [showToggle, setShowToggle] = useState(false);
    const [isClaimingBonus, setIsClaimingBonus] = useState(false);

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

    const handleClaimBonus = async () => {
        if (!dbUser) return;
        const { error } = await _claimBonus(dbUser.id);

        if (error) {
            toast.error("Failed to claim bonus");
            return;
        }

        setIsClaimingBonus(true);
        toast.success(`Bonus claimed! You've earned 25 Tokens.`);
        invalidateUser();
        setTimeout(() => setIsClaimingBonus(false), 1000);
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
        <div className="min-h-screen dark:bg-black">
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
                        onLogout={async () => {
                            const { error } = await supabase.auth.signOut();
                            if (error) toast.error("Failed to logout");
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
                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary",
                                        ((item.href === "/app" && pathname === "/app") ||
                                            (item.href !== "/app" &&
                                                pathname.startsWith(item.href))) &&
                                            "bg-secondary text-foreground",
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {!dbUser?.onboarding_completed && (
                    <OnboardingChecklistTrigger
                        userProgress={{ uploadedProductDemos: 1, referralCount: 5 }}
                        config={onboardingConfig}
                        onClaimBonus={handleClaimBonus}
                        isClaimingBonus={isClaimingBonus}
                    />
                )}

                {children}
            </div>
        </div>
    );
}
