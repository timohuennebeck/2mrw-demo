import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Asterisk } from "lucide-react";

const features = [
    {
        name: "Email authentication.",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
        icon: EnvelopeIcon,
        bgColor: "bg-purple-50",
    },
    {
        name: "SSL certificates.",
        description:
            "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
        icon: LockClosedIcon,
        bgColor: "bg-purple-50",
    },
    {
        name: "Simple queues.",
        description:
            "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus voluptas blanditiis et.",
        icon: ArrowPathIcon,
        bgColor: "bg-purple-50",
    },
];

const Features = ({ videoOnLeft }: { videoOnLeft?: boolean }) => {
    return (
        <div className="flex flex-col gap-20">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
                {videoOnLeft ? (
                    <div className="flex w-full flex-1 justify-start">
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
                ) : null}

                <div className="flex flex-1 flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-purple-50 p-2">
                            <Asterisk className="h-5 w-5 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium uppercase text-purple-600">
                            E2E TESTS WITH CYPRESS
                        </span>
                    </div>

                    <h2 className="max-w-4xl text-4xl font-medium tracking-tight md:text-5xl">
                        End-to-End Testing.{" "}
                        <span className="text-gray-400">
                            Built-in test coverage ensuring reliable authentication, billing, and
                            user flows.
                        </span>
                    </h2>
                </div>

                {!videoOnLeft ? (
                    <div className="flex w-full flex-1 justify-start">
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
                ) : null}
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                    <div key={feature.name} className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className={`${feature.bgColor} rounded-lg p-2`}>
                                <feature.icon
                                    className="h-6 w-6 text-purple-600"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                        <div>
                            <span className="font-medium">{feature.name}</span>{" "}
                            <span className="text-gray-600">{feature.description}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;
