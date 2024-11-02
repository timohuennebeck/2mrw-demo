import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import HeaderWithDescription from "../HeaderWithDescription";
import { useSession } from "@/context/SessionContext";
import useSubscription from "@/hooks/useSubscription";
import useFreeTrial from "@/hooks/useFreeTrial";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { formatDateToHumanFormat } from "@/lib/helper/formatDateToHumanFormat";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { useProducts } from "@/context/ProductsContext";
import { Product } from "@/interfaces/ProductInterfaces";
import { PlanFeatures } from "../PricingPlan/PlanFeatures";

const _getProductDetailsByPriceId = (products: Product[], stripePriceId: string) => {
    const product = products.find((product) => {
        // Check one-time price
        if (product.pricing.one_time?.stripe_price_id === stripePriceId) {
            return true;
        }

        // Check monthly subscription price
        if (product.pricing.subscription?.monthly?.stripe_price_id === stripePriceId) {
            return true;
        }

        // Check yearly subscription price
        if (product.pricing.subscription?.yearly?.stripe_price_id === stripePriceId) {
            return true;
        }

        return false;
    });

    if (!product) return null;

    // get the price details
    const priceDetails = _getPriceByStripePriceId(product, stripePriceId);

    return {
        name: product.name,
        features: product.features,
        description: product.description,
        price: priceDetails,
    };
};

const _getPriceByStripePriceId = (product: Product, stripePriceId: string) => {
    // check one-time price
    if (product.pricing.one_time?.stripe_price_id === stripePriceId) {
        return {
            amount: product.pricing.one_time.current,
            currency: product.pricing.one_time.currency,
            interval: "one-time",
        };
    }

    // check monthly subscription price
    if (product.pricing.subscription?.monthly?.stripe_price_id === stripePriceId) {
        return {
            amount: product.pricing.subscription.monthly.current,
            currency: product.pricing.subscription.monthly.currency,
            interval: "month",
        };
    }

    // check yearly subscription price
    if (product.pricing.subscription?.yearly?.stripe_price_id === stripePriceId) {
        return {
            amount: product.pricing.subscription.yearly.current,
            currency: product.pricing.subscription.yearly.currency,
            interval: "year",
        };
    }

    return null;
};

const _formatPriceDisplay = (price: { amount: number; currency: string; interval: string }) => {
    if (price.interval === "one-time") {
        return `${price.amount} ${price.currency} (OTP)`;
    }
    return `${price.amount} ${price.currency}/${price.interval}`;
};

const CurrentSubscriptionPlan = () => {
    const { user } = useSession();
    const { products } = useProducts();
    const { subscription } = useSubscription(user?.id ?? "");
    const { freeTrial } = useFreeTrial(user?.id ?? "");

    const activePriceId = freeTrial?.stripe_price_id || subscription?.stripe_price_id;

    if (!products) return null;

    const productDetails = activePriceId
        ? _getProductDetailsByPriceId(products, activePriceId)
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
                        {productDetails?.price && _formatPriceDisplay(productDetails?.price)}
                    </p>
                </div>
                <p className="mb-4 text-sm text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et odit autem alias
                    aut.
                </p>
                <p className="text-sm font-medium">
                    {freeTrial?.status === FreeTrialStatus.ACTIVE
                        ? `Your FREE TRIAL will end on ${formatDateToHumanFormat(freeTrial?.end_date)}.`
                        : subscription?.status === SubscriptionStatus.ACTIVE
                          ? `Your subscription will renew on ${formatDateToHumanFormat(subscription?.end_date)}.`
                          : `Your subscription has been cancelled and will end on ${formatDateToHumanFormat(
                                subscription?.end_date,
                            )}.`}
                </p>

                <div className="mt-4">
                    <PlanFeatures features={productDetails?.features ?? []} />
                </div>
            </div>
        </div>
    );
};

export default CurrentSubscriptionPlan;
