"use client";

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { BookOpen, Frame, Settings2 } from "lucide-react";
import { NavUser } from "./nav-user";
import { NavKnowledge } from "./nav-knowledge";
import { NavMain } from "./nav-main";

const navigationPaths = {
    main: [
        {
            name: "Home",
            url: "/app",
            icon: Frame,
        },
    ],
    navKnowledge: [
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
                {
                    title: "...",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "...",
                    url: "#",
                },
            ],
        },
    ],
};

const AppSidebar = () => {
    return (
        <Sidebar collapsible="icon" className="pt-2">
            <SidebarHeader>
                <NavUser />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navigationPaths.main} />
                <NavKnowledge items={navigationPaths.navKnowledge} />
            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;
