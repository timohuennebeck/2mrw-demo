import {
    CircleGauge,
    FileSearch,
    Database,
    ShieldOff,
    Mail,
    Tag,
    FileText,
    Search,
    CircleUserRound,
} from "lucide-react";

const LeftNavigationBar = () => {
    const iconsToUse = [
        {
            name: "",
            icon: <CircleGauge size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "",
            icon: <FileSearch size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "",
            icon: <Database size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "",
            icon: <ShieldOff size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "",
            icon: <Mail size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "",
            icon: <Tag size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "",
            icon: <FileText size={20} strokeWidth={1.5} />,
            link: "",
        },
    ];

    const bottomIcons = [
        {
            name: "",
            icon: <Search size={20} strokeWidth={1.5} />,
            link: "",
        },
        {
            name: "",
            icon: <CircleUserRound size={20} strokeWidth={1.5} />,
            link: "",
        },
    ];

    return (
        <nav className="flex w-14 flex-col items-center justify-between gap-2 border-r border-gray-200 bg-white px-2 py-2">
            <div>
                {iconsToUse.map((i, index) => {
                    return (
                        <div
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
                            key={index}
                        >
                            {i.icon}
                        </div>
                    );
                })}
            </div>

            <div>
                {bottomIcons.map((i, index) => {
                    return (
                        <div
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
                            key={index}
                        >
                            {i.icon}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
};

export default LeftNavigationBar;
