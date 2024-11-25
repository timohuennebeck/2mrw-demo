"use client";

import React from "react";
import {
    CreditCard,
    FileText,
    MapPinHouse,
    SquareArrowOutUpRight,
    Settings,
    CircleUserRound,
    Power,
} from "lucide-react";
import { toast } from "sonner";
import { TextConstants } from "@/constants/TextConstants";
import { useRouter, usePathname } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { createClient } from "@/services/integration/client";
import { NavigationItem, NavigationItems } from "./LeftNavigationBar.interface";

export const _handleSignOut = async (router: AppRouterInstance) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error(`${TextConstants.ERROR_SIGNING_OUT}: ${error.message}`);
        } else {
            router.replace("/auth/sign-in");

            toast.success(TextConstants.TEXT__LOGOUT_SUCCESSFUL);
        }
    } catch (err) {
        toast.error(`${TextConstants.ERROR__UNEXPECTED_ERROR} ${err}`);
    }
};

const _handleItemClick = (item: NavigationItem, router: AppRouterInstance) => {
    try {
        // handle external links
        if (item.isExternal && item.link) {
            window.open(item.link, "_blank");
            return;
        }

        // handle custom onClick handlers
        if (item.onClick) {
            item.onClick();
            return;
        }

        // handle internal navigation
        if (item.link) {
            router.push(item.link);
            return;
        }
    } catch (error) {
        console.error("Navigation error:", error);
    }
};

const LeftNavigationBar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navigationItems: NavigationItems[] = [
        {
            category: "Menu",
            items: [
                {
                    name: "Home",
                    icon: <MapPinHouse size={20} strokeWidth={2} />,
                    link: "/",
                },
                {
                    name: "Billing",
                    icon: <CreditCard size={20} strokeWidth={2} />,
                    link: "/billing",
                },
            ],
        },
        {
            category: "Help and Learning",
            items: [
                {
                    name: "Documentation",
                    icon: <FileText size={20} strokeWidth={2} />,
                    link: "/documentation",
                    isExternal: true,
                },
            ],
        },
        {
            category: "Preferences",
            items: [
                {
                    name: "Settings",
                    icon: <Settings size={20} strokeWidth={2} />,
                    link: "/settings",
                },
                {
                    name: "User Profile",
                    icon: <CircleUserRound size={20} strokeWidth={2} />,
                    link: "/user-profile",
                },
                {
                    name: "Logout",
                    icon: <Power size={20} strokeWidth={2} />,
                    onClick: () => _handleSignOut(router),
                },
            ],
        },
    ];

    return (
        <nav className="flex h-full flex-col items-start justify-start gap-2 overflow-y-auto px-6 py-4">
            {/* Logo */}
            <div className="mb-4 flex w-full items-center py-2">
                <div className="mr-2">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="Untitled UI"
                        width={24}
                        height={24}
                    />
                </div>
                <span className="text-sm font-semibold">Untitled UI</span>
                <span className="ml-auto text-xs text-gray-400">v4.0</span>
            </div>

            {/* Navigation Items */}
            <div className="w-full">
                {navigationItems.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="w-full">
                        {section.category && (
                            <h3 className="mb-2 mt-4 text-xs font-medium text-gray-400">
                                {section.category}
                            </h3>
                        )}
                        {section.items.map((item, itemIndex) => (
                            <div
                                key={itemIndex}
                                className={`group flex h-10 cursor-pointer items-center justify-between rounded-md px-3 ${
                                    pathname === item.link
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                                }`}
                                onClick={() => _handleItemClick(item, router)}
                            >
                                <div className="flex items-center">
                                    <div className="mr-3">{item.icon}</div>
                                    <span className="text-sm font-medium">{item.name}</span>
                                </div>
                                {item.isExternal && (
                                    <SquareArrowOutUpRight
                                        size={16}
                                        strokeWidth={2}
                                        className="ml-2"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default LeftNavigationBar;