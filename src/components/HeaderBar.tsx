import { FileText, Inbox, CircleUserRound } from "lucide-react";

const HeaderBar = () => {
    return (
        <header className="min-h-12 border-b border-neutral-200 bg-white">
            <div className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center space-x-4">
                    <div className="text-xs text-neutral-500">
                        Timo's SaaS Projects{" "}
                        <span className="rounded bg-neutral-100 px-2 py-1">Free</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1 text-xs text-neutral-800 hover:bg-neutral-50">
                        Feedback
                    </button>
                    <button className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1 text-xs text-neutral-800 hover:bg-neutral-50">
                        <FileText strokeWidth={1.25} size={16} />
                        Documentation
                    </button>

                    <div className="cursor-pointer rounded-md p-1 hover:bg-neutral-100">
                        <Inbox className="text-neutral-600" strokeWidth={1.25} size={16} />
                    </div>

                    <div className="cursor-pointer rounded-md p-1 hover:bg-neutral-100">
                        <CircleUserRound
                            className="text-neutral-600"
                            strokeWidth={1.25}
                            size={16}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderBar;
