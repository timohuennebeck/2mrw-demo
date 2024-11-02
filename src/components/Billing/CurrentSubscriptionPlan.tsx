import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import HeaderWithDescription from "../HeaderWithDescription";

const CurrentSubscriptionPlan = () => {
    return (
        <div>
            <HeaderWithDescription
                title="Your Plan"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam et odit autem alias aut praesentium vel nisi repudiandae saepe consectetur!"
            />

            <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center gap-2">
                            <CheckBadgeIcon className="h-5 w-5 text-black" aria-hidden="true" />
                            <h4 className="text-xl font-medium text-gray-700">Example Edition</h4>
                        </div>

                        <span className="ml-3 rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                            CANCELLED
                        </span>
                    </div>

                    <p className="text-2xl font-medium text-gray-700">$19.99/month</p>
                </div>
                <p className="mb-4 text-sm text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et odit autem alias
                    aut.
                </p>
                <p className="text-sm font-medium">
                    Your subscription will renew on December 02, 2023
                </p>

                <p className="mb-2 mt-4 text-base font-medium text-gray-700">Features</p>
                <ul className="flex flex-col gap-3" aria-label="Plan features">
                    {[...Array(5)].map((_, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckBadgeIcon className="h-5 w-5 text-black" aria-hidden="true" />
                            <span className="text-sm text-neutral-600">
                                Feature {index + 1} + Lorem ipsum dolor sit amet.
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CurrentSubscriptionPlan;
