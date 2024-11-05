import { ProductWithPrices } from "@/interfaces/ProductInterfaces";
import { BillingPlan, SubscriptionInterval } from "@/interfaces/StripePrices";

interface GetPriceParams {
    product: ProductWithPrices;
    billingPlan: BillingPlan;
    interval?: SubscriptionInterval;
}

export const getProductPriceByStripePriceId = (
    product: ProductWithPrices,
    stripePriceId: string,
) => {
    const price = product.prices.find((p) => p.stripe_price_id === stripePriceId);
    if (!price) return null;

    let interval: string;
    switch (true) {
        case price.billing_plan === BillingPlan.ONE_TIME:
            interval = BillingPlan.ONE_TIME;
            break;
        case price.subscription_interval === SubscriptionInterval.MONTHLY:
            interval = SubscriptionInterval.MONTHLY;
            break;
        case price.subscription_interval === SubscriptionInterval.YEARLY:
            interval = SubscriptionInterval.YEARLY;
            break;
        default:
            return null;
    }

    return {
        current: price.current_amount,
        previous: price.previous_amount,
        interval,
    };
};

export const getPrice = ({ product, billingPlan, interval }: GetPriceParams) => {
    const price = product.prices.find((price) => {
        const matchesBillingPlan = price.billing_plan === billingPlan;

        // check if the interval matches. FYI: one-time purchases don't need interval checking
        const matchesInterval =
            billingPlan === BillingPlan.ONE_TIME ||
            (interval ? price.subscription_interval === interval : true);

        return matchesBillingPlan && matchesInterval;
    });

    return price;
};

export const getProductDetailsByStripePriceId = (
    products: ProductWithPrices[],
    stripePriceId: string,
) => {
    const product = products.find((p) => {
        return p.prices.find((price) => price.stripe_price_id === stripePriceId);
    });

    if (!product) return null;

    // get the price details
    const priceDetails = getProductPriceByStripePriceId(product, stripePriceId);

    return {
        id: product.id,
        name: product.name,
        description: product.description,
        subscription_tier: product.subscription_tier,
        billing_plan: product.billing_plan,
        price: priceDetails,
    };
};

export const isSubscribedToPlan = (productStripePriceId: string, activeStripePriceId: string) => {
    if (!activeStripePriceId) return false;

    return productStripePriceId === activeStripePriceId;
};

export const getStripePriceIdBasedOnSelectedPlan = ({
    products,
    selectedPlanId,
    subscriptionInterval,
    billingPlan,
}: {
    products: ProductWithPrices[];
    selectedPlanId: string;
    subscriptionInterval: SubscriptionInterval;
    billingPlan: BillingPlan;
}) => {
    const selectedProduct = products.find((product) => product.id === selectedPlanId);
    if (!selectedProduct) return null;

    if (billingPlan === BillingPlan.ONE_TIME) {
        return selectedProduct.prices.find((price) => price.billing_plan === BillingPlan.ONE_TIME)
            ?.stripe_price_id;
    }

    return selectedProduct.prices.find(
        (price) => price.subscription_interval === subscriptionInterval,
    )?.stripe_price_id;
};
