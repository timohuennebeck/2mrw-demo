import { getCurrency } from "@/config/paymentConfig";
import { Product } from "@/interfaces/ProductInterfaces";

export const formatPriceDisplay = (price: {
    current: number;
    previous?: number;
    interval: string;
}) => {
    if (price.interval === "one-time") {
        return `${price.current} ${getCurrency()} (OTP)`;
    }

    return `${price.current} ${getCurrency()}/${price.interval.toUpperCase()}`;
};

export const getStripePriceIdBasedOnSelectedPlan = ({
    products,
    selectedPlan,
    selectedBillingCycle,
    isOneTimePaymentPlan,
}: {
    products: Product[];
    selectedPlan: string;
    selectedBillingCycle: string;
    isOneTimePaymentPlan: boolean;
}) => {
    const selectedProduct = products.find((product) => product.id === selectedPlan);

    if (!selectedProduct) return null;

    if (isOneTimePaymentPlan) {
        return selectedProduct.pricing.one_time?.stripe_price_id;
    }

    return selectedBillingCycle === "monthly"
        ? selectedProduct.pricing.subscription?.monthly?.stripe_price_id
        : selectedProduct.pricing.subscription?.yearly?.stripe_price_id;
};

export const getProductDetailsByStripePriceId = (products: Product[], stripePriceId: string) => {
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
    const priceDetails = getProductPriceByStripePriceId(product, stripePriceId);

    return {
        id: product.id,
        name: product.name,
        features: product.features,
        description: product.description,
        price: priceDetails,
    };
};

export const getProductPriceByStripePriceId = (product: Product, stripePriceId: string) => {
    // check one-time price
    if (product.pricing.one_time?.stripe_price_id === stripePriceId) {
        return {
            current: product.pricing.one_time.current,
            previous: product.pricing.one_time.previous,
            currency: product.pricing.one_time.currency,
            interval: "one-time",
        };
    }

    // check monthly subscription price
    if (product.pricing.subscription?.monthly?.stripe_price_id === stripePriceId) {
        return {
            current: product.pricing.subscription.monthly.current,
            previous: product.pricing.subscription.monthly.previous,
            currency: product.pricing.subscription.monthly.currency,
            interval: "month",
        };
    }

    // check yearly subscription price
    if (product.pricing.subscription?.yearly?.stripe_price_id === stripePriceId) {
        return {
            current: product.pricing.subscription.yearly.current,
            previous: product.pricing.subscription.yearly.previous,
            currency: product.pricing.subscription.yearly.currency,
            interval: "year",
        };
    }

    return null;
};
