import React from "react";
import LeftNavigationBar from "@/components/LeftNavigationBar";
import HeaderBar from "@/components/HeaderBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <LeftNavigationBar />
            <div className="w-64 border-r border-gray-200 bg-white"></div>
            <div className="flex flex-1 flex-col">
                <HeaderBar />
                <main className="flex-1 bg-neutral-50 p-6">{children}</main>
            </div>
        </div>
    );
}
