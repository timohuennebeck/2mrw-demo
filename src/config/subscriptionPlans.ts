export const SUBSCRIPTION_PLANS = [
    {
        name: "Standard Package (20% off)",
        description: "",
        priceId: "price_1Pahzt2KkHLYehJNekUQ3Bmz" as const,
        hasPremium: true,
        price: 44.95,
    },
    {
        name: "Elite Package (40% off)",
        description: "",
        priceId: "price_1Pahyu2KkHLYehJNG4ZoLtbv" as const,
        hasPremium: true,
        price: 59.95,
    },
] as const;

export type StripePriceId = (typeof SUBSCRIPTION_PLANS)[number]["priceId"];
