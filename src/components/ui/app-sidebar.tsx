"use client";

import { BadgeAlert, ChevronDown, ChevronUp, Building, Inbox, Settings, User2 } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarMenuSub,
    SidebarMenuBadge,
    SidebarHeader,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

import { toast } from "sonner";
import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "@/services/integration/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: Building,
    },
    {
        title: "Campaigns",
        icon: BadgeAlert,
        subItems: [
            { title: "Campaign One", url: "#" },
            { title: "Campaign Two", url: "#" },
            { title: "Campaign Three", url: "#" },
        ],
    },
    {
        title: "Tasks",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Leads",
        url: "#",
        icon: User2,
        badge: 10,
    },
    {
        title: "Templates",
        url: "#",
        icon: Settings,
    },
];

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

export function AppSidebar() {
    const { dbUser } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    const isSelected = (url: string) => {
        if (url === "/") {
            return pathname === url;
        }
        return pathname.startsWith(url);
    };

    return (
        <Sidebar>
            <SidebarHeader className="bg-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    Select Workspace
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Acme Corp.</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.subItems ? (
                                        <Collapsible defaultOpen className="w-full">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                    <ChevronDown className="ml-auto h-4 w-4" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.subItems.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                className={
                                                                    isSelected(subItem.url)
                                                                        ? "bg-gray-100"
                                                                        : ""
                                                                }
                                                            >
                                                                <span
                                                                    onClick={() =>
                                                                        router.push(subItem.url)
                                                                    }
                                                                >
                                                                    {subItem.title}
                                                                </span>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            className={isSelected(item.url) ? "bg-gray-100" : ""}
                                        >
                                            <div
                                                onClick={() => router.push(item.url)}
                                                className="cursor-pointer"
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                                {item.badge && (
                                                    <SidebarMenuBadge>
                                                        {item.badge}
                                                    </SidebarMenuBadge>
                                                )}
                                            </div>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="bg-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 />
                                    <span className="max-w-[150px] truncate">{dbUser?.email}</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span onClick={() => router.push("/user-profile")}>
                                        Personal Information
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span onClick={() => router.push("/billing")}>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span onClick={() => _handleSignOut(router)}>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
