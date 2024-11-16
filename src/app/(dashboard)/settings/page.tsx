import FormHeader from "@/components/forms/FormHeader";

const SettingsPage = () => {
    return (
        <>
            <div className="bg-white">
                <FormHeader
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
        </>
    );
};

export default SettingsPage;
