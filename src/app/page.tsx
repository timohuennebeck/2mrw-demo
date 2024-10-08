import DashboardLayout from "./DashboardLayout";

export default async function Home() {
    return (
        <DashboardLayout>
            <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
                <main className="row-start-2 flex flex-row items-center gap-2 sm:items-start">
                    <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">
                        src/app/page.tsx
                    </code>
                </main>
            </div>
        </DashboardLayout>
    );
}
