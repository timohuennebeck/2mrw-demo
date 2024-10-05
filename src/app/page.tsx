export default async function Home() {
    return (
        <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
            <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
                <h1 className="text-2xl font-medium">Yeeeah! You did it!</h1>
                <ul className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left">
                    <li className="mb-2">
                        Get started bY editing{" "}
                        <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">
                            src/app/page.tsx
                        </code>
                        .
                    </li>
                    <li className="mb-2">Save and see Your changes instantlY.</li>
                    <li>Reach that 10,000€ per month!</li>
                </ul>

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <a
                        className="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Read the docs
                    </a>
                </div>
            </main>
        </div>
    );
}
