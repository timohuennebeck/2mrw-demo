import { ProductWithPrices } from "@/interfaces/ProductInterfaces";
import { PricingModel, SubscriptionInterval } from "@/interfaces/StripePrices";

export class PricingService {
    static getProductPriceByStripePriceId(product: ProductWithPrices, stripePriceId: string) {
        const price = product.prices.find((p) => p.stripe_price_id === stripePriceId);
        if (!price) return null;

        let interval: string;
        switch (true) {
            case price.pricing_model === PricingModel.ONE_TIME:
                interval = PricingModel.ONE_TIME;
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
    }

    static getPrice({
        product,
        pricingModel,
        interval,
    }: {
        product: ProductWithPrices;
        pricingModel: PricingModel;
        interval?: SubscriptionInterval;
    }) {
        const price = product.prices.find((price) => {
            const matchesPricingModel = price.pricing_model === pricingModel;

            // check if the interval matches. FYI: one-time purchases don't need interval checking
            const matchesInterval =
                pricingModel === PricingModel.ONE_TIME ||
                (interval ? price.subscription_interval === interval : true);

            return matchesPricingModel && matchesInterval;
        });

        return price;
    }

    static getProductDetailsByStripePriceId(products: ProductWithPrices[], stripePriceId: string) {
        const product = products.find((p) => {
            return p.prices.find((price) => price.stripe_price_id === stripePriceId);
        });

        if (!product) return null;

        // get the price details
        const priceDetails = this.getProductPriceByStripePriceId(product, stripePriceId);

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            subscription_tier: product.subscription_tier,
            pricing_model: product.pricing_model,
            price: priceDetails,
        };
    }

    static isSubscribedToPlan(productStripePriceId: string, activeStripePriceId: string) {
        if (!activeStripePriceId) return false;

        return productStripePriceId === activeStripePriceId;
    }

    static getStripePriceIdBasedOnSelectedPlan({
        products,
        selectedPlan,
        selectedBillingCycle,
        isOneTimePaymentPlan,
    }: {
        products: ProductWithPrices[];
        selectedPlan: string;
        selectedBillingCycle: SubscriptionInterval;
        isOneTimePaymentPlan: boolean;
    }) {
        const selectedProduct = products.find((product) => product.id === selectedPlan);
        if (!selectedProduct) return null;

        if (isOneTimePaymentPlan) {
            return selectedProduct.prices.find(
                (price) => price.pricing_model === PricingModel.ONE_TIME,
            )?.stripe_price_id;
        }

        return selectedProduct.prices.find(
            (price) => price.subscription_interval === selectedBillingCycle,
        )?.stripe_price_id;
    }
}
