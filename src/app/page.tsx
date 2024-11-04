import HeaderWithDescription from "@/components/HeaderWithDescription";
import DashboardLayout from "./DashboardLayout";

const Home = () => {
    return (
        <DashboardLayout>
            <div className="bg-white">
                <HeaderWithDescription
                    title="Home"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                    isPageHeader
                />
            </div>
            <div className="flex h-full w-full items-center justify-center">
                <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold">
                    src/app/page.tsx
                </code>
            </div>
        </DashboardLayout>
    );
};

export default Home;
