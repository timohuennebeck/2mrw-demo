import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Code } from "lucide-react";

const features = [
    {
        name: "Email authentication.",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
        icon: EnvelopeIcon,
    },
    {
        name: "SSL certificates.",
        description:
            "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
        icon: LockClosedIcon,
    },
    {
        name: "Simple queues.",
        description:
            "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus voluptas blanditiis et.",
        icon: ArrowPathIcon,
    },
];

const Features = ({ isRight }: { isRight?: boolean }) => {
    return (
        <section className="py-24">
            <div className="flex flex-col gap-20">
                <div className={`${isRight ? "flex flex-col items-end" : ""} flex flex-col gap-6`}>
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-purple-50 p-2">
                            <Code className="h-5 w-5 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium uppercase text-purple-600">
                            E2E TESTS WITH CYPRESS
                        </span>
                    </div>
                    
                    <h2 className={`${isRight ? "text-right" : ""} text-4xl font-medium tracking-tight md:text-5xl`}>
                        End-to-End Testing.{" "}
                        <span className="text-gray-400">
                            Built-in test coverage ensuring reliable authentication, billing, and
                            user flows.
                        </span>
                    </h2>
                    
                    <p className={`${isRight ? "text-right" : ""} max-w-2xl text-lg text-gray-600`}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit
                        perferendis suscipit eaque, iste dolor cupiditate blanditiis.
                    </p>
                </div>

                <div className={`flex w-full ${isRight ? "justify-end" : "justify-start"}`}>
                    <video
                        src="https://framerusercontent.com/assets/hABzjRMXjNw1XA1si9W04jXifs.mp4"
                        width={928}
                        height={522}
                        className="rounded-lg shadow-2xl"
                        autoPlay
                        muted
                        loop
                    />
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.name} className="flex gap-4">
                            <div className="flex-shrink-0">
                                <feature.icon
                                    className="h-6 w-6 text-blue-600"
                                    aria-hidden="true"
                                />
                            </div>
                            <div>
                                <span className="font-medium">{feature.name}</span>{" "}
                                <span className="text-gray-600">{feature.description}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
