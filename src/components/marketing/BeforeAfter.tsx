import { Code, Check, X } from "lucide-react";
import Image from "next/image";

interface BeforeAfterItem {
    title: string;
    bulletPoints: {
        text: string;
        isPositive: boolean;
    }[];
    imagePath: string;
}

const beforeAfter: { before: BeforeAfterItem; after: BeforeAfterItem } = {
    before: {
        title: "Lorem ipsum dolor sit amet.",
        bulletPoints: [
            { text: "Lorem ipsum dolor sit amet consectetur adipisicing elit", isPositive: false },
            { text: "Explicabo alias corrupti natus a cupiditate mollitia", isPositive: false },
            { text: "Dignissimos asperiores possimus laboriosam", isPositive: false },
            { text: "Iusto quo ducimus maiores eveniet", isPositive: false },
        ],
        imagePath: "https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4",
    },
    after: {
        title: "Lorem ipsum dolor sit amet.",
        bulletPoints: [
            { text: "Lorem ipsum dolor sit amet consectetur adipisicing elit", isPositive: true },
            { text: "Explicabo alias corrupti natus a cupiditate mollitia", isPositive: true },
            { text: "Dignissimos asperiores possimus laboriosam", isPositive: true },
            { text: "Iusto quo ducimus maiores eveniet", isPositive: true },
        ],
        imagePath: "https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4",
    },
};

const BeforeAfter = () => {
    return (
        <div className="flex flex-col gap-20">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <p className="text-sm font-medium text-blue-600">Lorem, ipsum.</p>
                    <h2 className="text-4xl max-w-4xl font-medium tracking-tight md:text-5xl">
                        Lorem, ipsum.{" "}
                        <span className="text-gray-400">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, corporis.
                        </span>
                    </h2>
                </div>
                <p className="max-w-3xl text-lg text-gray-600">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto quo ducimus
                    maiores eveniet. Dignissimos asperiores possimus laboriosam quos temporibus.
                    Iure.
                </p>
            </div>

            {/* Before/After Grid */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Before Section */}
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                                BEFORE
                            </div>
                            <h3 className="text-xl font-medium">{beforeAfter.before.title}</h3>
                        </div>
                        <ul className="space-y-3">
                            {beforeAfter.before.bulletPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-600">
                                    <X className="mt-1 h-4 w-4 flex-shrink-0 text-red-500" />
                                    {point.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
                        <video
                            src={beforeAfter.before.imagePath}
                            width={1200}
                            height={675}
                            className="rounded-lg shadow-2xl"
                            autoPlay
                            muted
                            loop
                        />
                    </div>
                </div>

                {/* After Section */}
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                                AFTER
                            </div>
                            <h3 className="text-xl font-medium">{beforeAfter.after.title}</h3>
                        </div>
                        <ul className="space-y-3">
                            {beforeAfter.after.bulletPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-600">
                                    <Check className="mt-1 h-4 w-4 flex-shrink-0 text-blue-600" />
                                    {point.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
                        <video
                            src={beforeAfter.after.imagePath}
                            width={1200}
                            height={675}
                            className="rounded-lg shadow-2xl"
                            autoPlay
                            muted
                            loop
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeforeAfter;
