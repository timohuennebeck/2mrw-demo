export const SUBSCRIPTION_PLANS = [
    {
        priceId: "price_1Pahzt2KkHLYehJNekUQ3Bmz" as const,
        name: "Standard Package (20% off)",
        hasPremium: true,
    },
    {
        priceId: "price_1Pahyu2KkHLYehJNG4ZoLtbv" as const,
        name: "Elite Package (40% off)",
        hasPremium: true,
    },
] as const;

export type StripePriceId = (typeof SUBSCRIPTION_PLANS)[number]["priceId"];
