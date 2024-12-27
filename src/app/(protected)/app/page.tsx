"use client";

const DemoPage = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <p className="rounded-sm bg-gray-100 px-4 py-2 text-sm">
                Pages such as the Documentation, Introduction, Settings, etc. are just for demo
                purposes to show how the sidebar works.
            </p>

            <p className="rounded-sm bg-gray-100 px-4 py-2 text-sm mt-4">
                You can go to the <span className="font-semibold">src/app/page.tsx</span> file to
                edit this page
            </p>
        </div>
    );
};

export default DemoPage;
