import { Code } from "lucide-react";
import Image from "next/image";

interface BeforeAfterItem {
    title: string;
    description: string;
    imagePath: string;
}

const beforeAfter: { before: BeforeAfterItem; after: BeforeAfterItem } = {
    before: {
        title: "Lorem ipsum dolor sit amet.",
        description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo alias corrupti natus a cupiditate mollitia?",
        imagePath: "/before-screenshot.png",
    },
    after: {
        title: "Lorem ipsum dolor sit amet.",
        description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo alias corrupti natus a cupiditate mollitia?",
        imagePath: "/after-screenshot.png",
    },
};

const BeforeAfter = () => {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div>
                    <p className="text-sm font-medium text-blue-600">Before & After</p>
                    <h2 className="mt-6 text-4xl font-medium tracking-tight md:text-5xl">
                        Lorem, ipsum.{" "}
                        <span className="text-gray-400">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, corporis.
                        </span>
                    </h2>
                    <p className="mt-6 max-w-4xl text-lg text-gray-600">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto quo ducimus
                        maiores eveniet. Dignissimos asperiores possimus laboriosam quos temporibus.
                        Iure.
                    </p>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Before Section */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                                BEFORE
                            </div>
                            <h3 className="text-xl font-medium">{beforeAfter.before.title}</h3>
                        </div>
                        <p className="text-gray-600">{beforeAfter.before.description}</p>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
                            <Image
                                src={beforeAfter.before.imagePath}
                                alt="Before using our boilerplate"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* After Section */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
                                AFTER
                            </div>
                            <h3 className="text-xl font-medium">{beforeAfter.after.title}</h3>
                        </div>
                        <p className="text-gray-600">{beforeAfter.after.description}</p>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
                            <Image
                                src={beforeAfter.after.imagePath}
                                alt="After using our boilerplate"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BeforeAfter;
