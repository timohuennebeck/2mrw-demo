"use client";

import { ChevronDown, ChevronUp, Building, User2, Users } from "lucide-react";
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
        url: "/dashboard",
        icon: Building,
    },
    {
        title: "Team",
        url: "/team",
        icon: Users,
        subItems: [
            { title: "Members", url: "/team/members" },
            { title: "Roles", url: "/team/roles" },
            { title: "Invites", url: "/team/invites" },
        ],
    },
];

export const _handleSignOut = async (router: AppRouterInstance) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error(`${TextConstants.ERROR_SIGNING_OUT}: ${error.message}`);
        } else {
            // wait for a brief moment to ensure cookies are cleared
            await new Promise((resolve) => setTimeout(resolve, 100));

            // uses window.location.href to force a page reload to ensure cookies are cleared
            window.location.href = "/auth/sign-in";

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
        if (url === "/dashboard") {
            return pathname === url;
        }
        return pathname.startsWith(url);
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.subItems ? (
                                        <Collapsible defaultOpen className="w-full">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    tooltip={item.title}
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                    <ChevronDown className="ml-auto h-4 w-4" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.subItems.map((subItem) => (
                                                        <SidebarMenuSubItem
                                                            key={subItem.title}
                                                            className="cursor-pointer"
                                                        >
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
                                            className={
                                                isSelected(item.url)
                                                    ? "bg-gray-100"
                                                    : ""
                                            }
                                        >
                                            <div
                                                onClick={() => router.push(item.url)}
                                                className="cursor-pointer"
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
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
                                <DropdownMenuItem className="cursor-pointer">
                                    <span onClick={() => router.push("/user-profile")}>
                                        Personal Information
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <span onClick={() => router.push("/billing")}>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
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
