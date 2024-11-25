const CTASection = () => {
    return (
        <div className="flex flex-col items-center gap-6">
            <p className="text-sm font-medium text-blue-600">CTA</p>
            <h2 className="max-w-4xl text-center text-4xl font-medium tracking-tight md:text-5xl">
                Lock in €30 OFF Forever. Use 'Launch30' at checkout
            </h2>

            <p className="max-w-3xl text-center text-lg text-gray-600">
                Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam
                aliqua proident excepteur commodo do ea.
            </p>

            <div className="flex items-center justify-center gap-4">
                <button className="rounded-md bg-black px-6 py-2.5 text-white transition-colors hover:bg-gray-800">
                    Get started
                </button>
                <button className="flex items-center gap-2 rounded-md bg-gray-100 px-6 py-2.5 transition-colors hover:bg-gray-200">
                    Learn more
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CTASection;
