"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { TextConstants } from "@/constants/TextConstants";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/services/integration/client";
import { Building, ChevronUp, CreditCard, Power, Settings, User2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Building,
    },
    {
        title: "Billing",
        url: "/dashboard/billing",
        icon: CreditCard,
    },
];

export const _handleSignOut = async () => {
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
    const { open } = useSidebar();

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
            <SidebarHeader
                className={`bg-white ${open ? "flex flex-row items-center p-4" : "flex items-center justify-center"}`}
            >
                <Image
                    src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                    alt="Logo"
                    width={24}
                    height={24}
                />
                {open && <span className="text-lg font-semibold">2mrw</span>}
            </SidebarHeader>
            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col gap-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        className={
                                            isSelected(item.url)
                                                ? "bg-slate-100"
                                                : "hover:bg-slate-100"
                                        }
                                    >
                                        <div
                                            onClick={() => router.push(item.url)}
                                            className="cursor-pointer"
                                        >
                                            <item.icon />
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                    </SidebarMenuButton>
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
                                    <Settings />
                                    <span className="max-w-[150px] truncate">{dbUser?.email}</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className={open ? "w-[--radix-popper-anchor-width]" : "ml-2"}
                            >
                                <DropdownMenuItem
                                    className="cursor-pointer whitespace-nowrap"
                                    onClick={() => router.push("/dashboard/user-profile")}
                                >
                                    <User2 />
                                    Personal Information
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={_handleSignOut}
                                >
                                    <Power />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
