import React from "react";
import LeftNavigationBar from "@/components/LeftNavigationBar";
import { ChevronRight } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <LeftNavigationBar />
            <div className="h-full flex-1 p-2 pl-0">
                <main className="h-full overflow-scroll scrollbar-hide rounded-lg border border-neutral-200 bg-white p-6">
                    <div className="mb-4 flex items-center space-x-2 text-sm text-gray-500">
                        <span className="font-medium text-neutral-500">Home</span>
                        <ChevronRight size={16} />
                        <span className="font-medium text-neutral-500">...</span>
                        <ChevronRight size={16} />
                        <span className="font-medium text-neutral-800">Personal Profile</span>
                    </div>

                    <div className="p-4">{children}</div>
                </main>
            </div>
        </div>
    );
}
