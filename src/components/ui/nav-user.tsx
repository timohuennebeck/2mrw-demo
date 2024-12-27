"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { TextConstants } from "@/constants/TextConstants";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/services/integration/client";
import { CreditCard, Ellipsis, Power, Sparkles, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NavUser() {
    const { dbUser } = useUser();

    const { isMobile } = useSidebar();

    const router = useRouter();

    const _handleSignOut = async () => {
        const supabase = createClient();

        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                toast.error(`${TextConstants.ERROR_SIGNING_OUT}: ${error.message}`);
            } else {
                // wait for a brief moment to ensure cookies are cleared
                await new Promise((resolve) => setTimeout(resolve, 100));

                // uses window.location.href to force a page reload to ensure cookies are cleared
                router.replace("/auth/sign-in?method=magic-link&feedback=logged-out");
            }
        } catch (err) {
            toast.error(`${TextConstants.ERROR__UNEXPECTED_ERROR} ${err}`);
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={dbUser?.profile_image_url}
                                    alt={dbUser?.first_name}
                                />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{dbUser?.first_name}</span>
                                <span className="truncate text-xs">{dbUser?.email}</span>
                            </div>
                            <Ellipsis className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={dbUser?.profile_image_url}
                                        alt={dbUser?.first_name}
                                    />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {dbUser?.first_name}
                                    </span>
                                    <span className="truncate text-xs">{dbUser?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <div className="px-2">
                            <DropdownMenuSeparator />
                        </div>
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => router.push("/choose-pricing-plan")}
                            >
                                <Sparkles />
                                Upgrade to Premium
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <div className="px-2">
                            <DropdownMenuSeparator />
                        </div>
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => router.push("/app/user-profile")}
                            >
                                <User2 />
                                Personal Information
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => router.push("/app/billing")}
                            >
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-pointer" onClick={_handleSignOut}>
                            <Power />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
