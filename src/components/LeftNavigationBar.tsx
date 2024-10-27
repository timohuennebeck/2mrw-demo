"use client";

import React from "react";
import {
    Users,
    CreditCard,
    FileText,
    MapPinHouse,
    SquareArrowOutUpRight,
    Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { TextConstants } from "@/constants/TextConstants";
import { useRouter, usePathname } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";

interface HandleSignOutProps {
    supabaseClient: SupabaseClient;
    router: AppRouterInstance;
}

export const _handleSignOut = async ({ supabaseClient, router }: HandleSignOutProps) => {
    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            toast.error(`${TextConstants.ERROR_SIGNING_OUT}: ${error.message}`);
        } else {
            toast.success(TextConstants.TEXT__LOGOUT_SUCCESSFUL);

            router.replace("/auth/sign-in");
        }
    } catch (err) {
        toast.error(`${TextConstants.ERROR__UNEXPECTED_ERROR} ${err}`);
    }
};

const LeftNavigationBar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navigationItems = [
        {
            category: "MENU",
            items: [{ name: "Home", icon: <MapPinHouse size={20} strokeWidth={2} />, link: "/" }],
        },
        {
            category: "ADMINISTRATION",
            items: [
                {
                    name: "User management",
                    icon: <Users size={20} strokeWidth={2} />,
                    link: "/user-management",
                },
                {
                    name: "Billing",
                    icon: <CreditCard size={20} strokeWidth={2} />,
                    link: "/billing",
                },
            ],
        },
        {
            category: "SETTINGS",
            items: [
                {
                    name: "Settings",
                    icon: <Settings2 size={20} strokeWidth={2} />,
                    link: "/settings",
                },
                {
                    name: "Documentation",
                    icon: <FileText size={20} strokeWidth={2} />,
                    link: "/documentation",
                    isExternal: true,
                },
            ],
        },
    ];

    return (
        <nav className="flex h-full flex-col items-start justify-start gap-2 overflow-y-auto bg-neutral-50 px-4 py-2">
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
                <span className="ml-auto text-xs text-neutral-400">v4.0</span>
            </div>

            {/* Navigation Items */}
            <div className="w-full">
                {navigationItems.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="w-full">
                        {section.category && (
                            <h3 className="mb-2 mt-4 text-xs font-semibold text-neutral-400">
                                {section.category}
                            </h3>
                        )}
                        {section.items.map((item, itemIndex) => (
                            <div
                                key={itemIndex}
                                className={`group flex h-10 cursor-pointer items-center justify-between rounded-md px-3 ${
                                    pathname === item.link
                                        ? "bg-neutral-100 text-neutral-900"
                                        : "text-neutral-500 hover:bg-neutral-100"
                                }`}
                                onClick={() =>
                                    item.isExternal
                                        ? window.open(item.link, "_blank")
                                        : router.push(item.link)
                                }
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

            {/* User Profile */}
            <div
                className="mt-auto w-full cursor-pointer pt-4"
                onClick={() => router.push("/user-profile")}
            >
                <div className="flex items-center rounded-md px-3 py-2 hover:bg-neutral-100">
                    <div className="relative h-8 w-8 rounded-full border-2 border-neutral-200">
                        <Image
                            src="https://framerusercontent.com/images/bFuS8dh0c2VYIBRtknYJJUJnq8.jpg?scale-down-to=1024"
                            alt="User"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                        />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-900">Timo Huennebeck</p>
                        <p className="text-xs text-neutral-500">m@example.com</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LeftNavigationBar;
