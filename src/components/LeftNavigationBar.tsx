"use client";

import React, { useState } from "react";
import {
    CircleGauge,
    FileSearch,
    Database,
    ShieldOff,
    Mail,
    Tag,
    FileText,
    Search,
    CircleUserRound,
} from "lucide-react";
import DropdownSelection from "./ui/DropdownSelection";
import { toast } from "sonner";
import { TextConstants } from "@/constants/TextConstants";
import { useRouter } from "next/navigation";
import { createClient } from "@/services/supabase/client";
import { handleSignOut } from "@/lib/helper/logoutUser";
import { SupabaseClient } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
    const [showDropdown, setShowDropdown] = useState(false);

    const supabaseClient = createClient();
    const router = useRouter();

    const iconsToUse = [
        {
            name: "Dashboard",
            icon: <CircleGauge size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "Files",
            icon: <FileSearch size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "Database",
            icon: <Database size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "SecuritY",
            icon: <ShieldOff size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "Mail",
            icon: <Mail size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "Tags",
            icon: <Tag size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "Documents",
            icon: <FileText size={20} strokeWidth={1.5} />,
            link: "",
        },
    ];

    const bottomIcons = [
        {
            name: "Search",
            icon: <Search size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "User",
            icon: <CircleUserRound size={20} strokeWidth={1.5} />,
            link: "",
            onClick: () => setShowDropdown((prev) => !prev),
        },
    ];

    const dropDownItems = [
        {
            name: "Personal Profile",
            onClick: () => {},
        },
        {
            name: "Logout",
            onClick: () => _handleSignOut({ supabaseClient, router }),
        },
    ];

    return (
        <nav className="flex w-14 flex-col items-center justify-between gap-2 border-r border-gray-200 bg-white px-2 py-2">
            <div>
                {iconsToUse.map((i, index) => (
                    <div
                        className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
                        key={index}
                    >
                        {i.icon}
                        <span className="absolute left-full ml-1 cursor-default rounded border bg-white px-2 py-1 text-xs text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
                            {i.name}
                        </span>
                    </div>
                ))}
            </div>

            <div>
                <div className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100">
                    <Search size={20} strokeWidth={1.5} />
                </div>
                <DropdownSelection />
            </div>
        </nav>
    );
};

export default LeftNavigationBar;
