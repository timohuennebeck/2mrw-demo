export const SUBSCRIPTION_PLANS = [
    {
        name: "Essentials",
        description: "*For freelancers and solopreneurs",
        additionalInfo: "This plan is 20% off for the first 50 customers (47 left)",
        previousPrice: 53.95,
        price: 44.95,
        stripePriceId: "price_1Pahzt2KkHLYehJNekUQ3Bmz",
        stripePaymentLink: "https://buy.stripe.com/test_dR64k3gc96TF5DWbIL",
        buttonCta: "Get Started Now (20% off)",
        features: [
            { name: "Feature", included: true },
            { name: "Feature-02", included: true },
            { name: "Feature-03", included: false },
            { name: "Feature-04", included: false },
            { name: "Feature-05", included: false },
        ],
        isHighlighted: false,
    },
    {
        name: "Founders Edition",
        description: "*For freelancers and solopreneurs",
        additionalInfo: "This plan is 20% off for the first 50 customers (47 left)",
        previousPrice: 71.95,
        price: 59.95,
        stripePriceId: "price_1Pahyu2KkHLYehJNG4ZoLtbv",
        stripePaymentLink: "https://buy.stripe.com/test_28oaIr4tra5R2rK5km",
        buttonCta: "Get Started Now (40% off)",
        features: [
            { name: "Feature", included: true },
            { name: "Feature-02", included: true },
            { name: "Feature-03", included: false },
            { name: "Feature-04", included: false },
            { name: "Feature-05", included: false },
        ],
        isHighlighted: true,
    },
];

export type StripePriceId = (typeof SUBSCRIPTION_PLANS)[number]["stripePriceId"];
