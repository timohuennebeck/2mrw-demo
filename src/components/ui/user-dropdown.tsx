import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LucideIcon, Power } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
    user: {
        name: string;
        email: string;
        initials: string;
    };
    menuItems: {
        label: string;
        href: string;
        icon: LucideIcon;
    }[];
    onLogout: () => void;
}

export default function UserDropdown({ user, menuItems, onLogout }: UserDropdownProps) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{user.initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback className="rounded-lg">{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                    {menuItems.map((item) => (
                        <DropdownMenuItem
                            key={item.href}
                            className="cursor-pointer"
                            onClick={() => router.push(item.href)}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                        <Power className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
