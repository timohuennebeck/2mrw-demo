import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { ProductWithPrices } from "@/interfaces/ProductInterfaces";
import { BillingPlan, StripePrice, SubscriptionInterval } from "@/interfaces/StripePrices";

interface GetPriceParams {
    product: ProductWithPrices;
    billingPlan: BillingPlan;
    interval?: SubscriptionInterval;
}

interface GetStripePriceIdParams {
    products: ProductWithPrices[];
    selectedPlanId: string;
    subscriptionInterval: SubscriptionInterval;
    billingPlan: BillingPlan;
}

const _getIntervalFromPrice = (price: StripePrice) => {
    if (price.billing_plan === BillingPlan.ONE_TIME) {
        return BillingPlan.ONE_TIME;
    }

    if (price.subscription_interval) {
        return price.subscription_interval;
    }

    return null;
};

const _getProductPriceByStripePriceId = (product: ProductWithPrices, stripePriceId: string) => {
    const price = product.prices.find((p) => p.stripe_price_id === stripePriceId);
    if (!price) return null;

    const interval = _getIntervalFromPrice(price);
    if (!interval) return null;

    return {
        current_amount: price.current_amount,
        previous_amount: price.previous_amount,
        interval,
    };
};

export const getPrice = ({ product, billingPlan, interval }: GetPriceParams) => {
    const price = product.prices.find((price) => {
        const matchesBillingPlan = price.billing_plan === billingPlan;

        // check if the interval matches
        // one-time purchases don't need interval checking
        const matchesInterval =
            billingPlan === BillingPlan.ONE_TIME ||
            (interval ? price.subscription_interval === interval : true);

        return matchesBillingPlan && matchesInterval;
    });

    return price;
};

export const getProductDetailsByStripePriceId = (
    products: ProductWithPrices[],
    stripePriceId: string | null,
) => {
    /*
     * if the stripePriceId is null, the user is on the free plan
     * so we need to get the free product details
     */

    if (!stripePriceId) {
        const freeProduct = products.find((p) => p.billing_plan === BillingPlan.NONE);
        if (!freeProduct) return null;

        return {
            id: freeProduct.id,
            name: freeProduct.name,
            description: freeProduct.description,
            subscription_tier: freeProduct.subscription_tier,
            billing_plan: freeProduct.billing_plan,
            price: {
                current_amount: 0,
                previous_amount: 0,
                interval: SubscriptionInterval.NONE, // free plan doesn't have an interval as the cycles can either be monthly or yearly
            },
        };
    }

    // handle paid plans such as monthly, yearly, and one-time payment
    const product = products.find((p) => {
        return p.prices.find((price) => price.stripe_price_id === stripePriceId);
    });
    if (!product) return null;

    const pricing = _getProductPriceByStripePriceId(product, stripePriceId);
    if (!pricing) return null;

    const { current_amount, previous_amount, interval } = pricing;

    return {
        id: product.id,
        name: product.name,
        description: product.description,
        subscription_tier: product.subscription_tier,
        billing_plan: product.billing_plan,
        price: { current_amount, previous_amount, interval },
    };
};

export const getStripePriceIdBasedOnSelectedPlanId = ({
    products,
    selectedPlanId,
    subscriptionInterval,
    billingPlan,
}: GetStripePriceIdParams) => {
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

export const getPriceForCurrentProduct = (
    prices: StripePrice[],
    subscriptionInterval: SubscriptionInterval,
) => {
    if (isOneTimePaymentEnabled()) {
        const oneTimePrice = prices.find((p) => p.billing_plan === BillingPlan.ONE_TIME);

        return {
            current_amount: oneTimePrice?.current_amount ?? 0,
            previous_amount: oneTimePrice?.previous_amount ?? 0,
            stripe_price_id: oneTimePrice?.stripe_price_id ?? "",
            interval: oneTimePrice?.subscription_interval ?? SubscriptionInterval.NONE,
        };
    }

    if (subscriptionInterval === SubscriptionInterval.YEARLY) {
        const yearlyPrice = prices.find(
            (p) => p.subscription_interval === SubscriptionInterval.YEARLY,
        );

        return {
            current_amount: yearlyPrice?.current_amount ?? 0,
            previous_amount: yearlyPrice?.previous_amount ?? 0,
            stripe_price_id: yearlyPrice?.stripe_price_id ?? "",
            interval: yearlyPrice?.subscription_interval ?? SubscriptionInterval.YEARLY,
        };
    } else {
        const monthlyPrice = prices.find(
            (p) => p.subscription_interval === SubscriptionInterval.MONTHLY,
        );

        return {
            current_amount: monthlyPrice?.current_amount ?? 0,
            previous_amount: monthlyPrice?.previous_amount ?? 0,
            stripe_price_id: monthlyPrice?.stripe_price_id ?? "",
            interval: monthlyPrice?.subscription_interval ?? SubscriptionInterval.MONTHLY,
        };
    }
};
