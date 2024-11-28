import React from "react";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { cookies } from "next/headers";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const TopBar = () => {
    return (
        <div className="flex items-center gap-4 px-4 py-4">
            <SidebarTrigger />

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = cookies();
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <div className="flex h-screen w-full overflow-hidden">
                <Sidebar className="border-r">
                    <SidebarContent>
                        <AppSidebar />
                    </SidebarContent>
                </Sidebar>

                <SidebarInset>
                    <main className="h-full overflow-scroll scrollbar-hide">
                        <TopBar />

                        <div className="px-8 py-8">{children}</div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
