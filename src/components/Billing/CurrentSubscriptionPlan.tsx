import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import HeaderWithDescription from "../HeaderWithDescription";
import { useSession } from "@/context/SessionContext";
import useSubscription from "@/hooks/useSubscription";
import useFreeTrial from "@/hooks/useFreeTrial";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { formatDateToHumanFormat } from "@/lib/helper/formatDateToHumanFormat";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { useProducts } from "@/context/ProductsContext";
import { PlanFeatures } from "../PricingPlan/PlanFeatures";
import { formatPriceDisplay, getProductDetailsByStripePriceId } from "@/lib/helper/priceHelper";

const CurrentSubscriptionPlan = () => {
    const { authUser } = useSession();
    const { products } = useProducts();
    const { subscription } = useSubscription(authUser?.id ?? "");
    const { freeTrial } = useFreeTrial(authUser?.id ?? "");

    const activePriceId = subscription?.stripe_price_id || freeTrial?.stripe_price_id;

    if (!products) return null;

    const productDetails = activePriceId
        ? getProductDetailsByStripePriceId(products, activePriceId)
        : null;

    const renderStatusBadge = (text: string, variant: "green" | "yellow" | "red") => {
        const colors = {
            green: "bg-green-100 text-green-800",
            yellow: "bg-yellow-100 text-yellow-800",
            red: "bg-red-100 text-red-800",
        };

        return (
            <span className={`ml-3 rounded-md px-3 py-1 text-xs font-medium ${colors[variant]}`}>
                {text}
            </span>
        );
    };

    const renderSubscriptionStatus = () => {
        if (freeTrial?.status === FreeTrialStatus.ACTIVE) {
            return (
                <>
                    {renderStatusBadge("ACTIVE", "green")}
                    {renderStatusBadge("FREE TRIAL", "yellow")}
                </>
            );
        }

        if (subscription?.status === SubscriptionStatus.ACTIVE) {
            return renderStatusBadge("ACTIVE", "green");
        }

        if (
            subscription?.status === SubscriptionStatus.CANCELLED ||
            freeTrial?.status === FreeTrialStatus.CANCELLED
        ) {
            return renderStatusBadge("CANCELLED", "red");
        }

        return null;
    };

    const getSubscriptionStatusMessage = () => {
        if (freeTrial?.end_date === null || subscription?.end_date === null) {
            return null;
        }

        if (freeTrial?.status === FreeTrialStatus.ACTIVE) {
            return `Your FREE TRIAL will end on ${formatDateToHumanFormat(freeTrial?.end_date)}.`;
        } else if (subscription?.status === SubscriptionStatus.ACTIVE) {
            return `Your subscription will renew on ${formatDateToHumanFormat(subscription?.end_date)}.`;
        } else if (subscription?.status === SubscriptionStatus.CANCELLED) {
            return `Your subscription has been cancelled and will end on ${formatDateToHumanFormat(subscription?.end_date)}.`;
        }

        return null;
    };

    return (
        <div>
            <HeaderWithDescription
                title="Your Plan"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam et odit autem alias aut praesentium vel nisi repudiandae saepe consectetur!"
            />

            <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckBadgeIcon className="h-5 w-5 text-black" aria-hidden="true" />
                            <h4 className="text-xl font-medium text-gray-700">
                                {productDetails?.name}
                            </h4>
                        </div>

                        {renderSubscriptionStatus()}
                    </div>

                    <p className="text-2xl font-medium text-gray-700">
                        {productDetails?.price && formatPriceDisplay(productDetails.price)}
                    </p>
                </div>
                <p className="mb-4 text-sm text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et odit autem alias
                    aut.
                </p>
                <p className="text-sm font-medium">{getSubscriptionStatusMessage()}</p>

                <div className="mt-4">
                    <PlanFeatures features={productDetails?.features ?? []} />
                </div>
            </div>
        </div>
    );
};

export default CurrentSubscriptionPlan;
