import DashboardLayout from "../DashboardLayout";
import HeaderWithDescription from "@/components/HeaderWithDescription";

const SettingsPage = () => {
    return (
        <DashboardLayout>
            <div className="bg-white">
                <HeaderWithDescription
                    title="Settings"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                    isPageHeader
                />
            </div>
            <div className="flex h-full w-full items-center justify-center">
                <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold">
                    src/app/settings/page.tsx
                </code>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
