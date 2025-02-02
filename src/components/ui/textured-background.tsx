const TexturedBackground = () => (
    <>
        {/* light theme background */}
        <div className="fixed inset-0 -z-10 h-full w-full opacity-100 dark:opacity-0">
            <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-100 [background-size:16px_16px]" />
        </div>

        {/* dark theme background */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-black opacity-0 dark:opacity-100">
            <div className="h-full w-full bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-0 [background-size:16px_16px] dark:opacity-50" />
        </div>
    </>
);

export default TexturedBackground;
