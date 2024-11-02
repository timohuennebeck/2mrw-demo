export const formatPriceDisplay = (price: {
    current: number;
    previous?: number;
    currency: string;
    interval: string;
}) => {
    if (price.interval === "one-time") {
        return `${price.current} ${price.currency} (OTP)`;
    }

    return `${price.current} ${price.currency}/${price.interval.toUpperCase()}`;
};

import { Product } from "@/interfaces/ProductInterfaces";

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
