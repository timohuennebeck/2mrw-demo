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
import { useRouter } from "next/navigation";
const items = [
    {
        title: "Dashboard",
        url: "#",
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
    const router = useRouter();

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
                                                <SidebarMenuButton>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                    <ChevronDown className="ml-auto h-4 w-4" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.subItems.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <a href={subItem.url}>
                                                                    {subItem.title}
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                                {item.badge && (
                                                    <SidebarMenuBadge>
                                                        {item.badge}
                                                    </SidebarMenuBadge>
                                                )}
                                            </a>
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
                                    <User2 /> Username
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
