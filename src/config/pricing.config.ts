import { BillingPeriod, BillingPlan, SubscriptionTier } from "@/enums";

export interface DefaultPricingPlan {
    name: string;
    description: string;
    price: string;
    billing_period: BillingPeriod;
    billing_plan: BillingPlan;
    is_highlighted: boolean;
    stripe_price_id: string;
    subscription_tier: SubscriptionTier;
}

export interface PricingFeatureSection {
    category: string;
    items: PricingFeatureItem[];
}

export interface PricingFeatureItem {
    name: string;
    free?: boolean | string;
    pro: boolean | string;
    enterprise: boolean | string;
}

export const defaultPricingPlans: {
    monthly: DefaultPricingPlan[];
    annual: DefaultPricingPlan[];
    oneTime: DefaultPricingPlan[];
} = {
    monthly: [
        {
            name: SubscriptionTier.FREE,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$0",
            billing_period: BillingPeriod.MONTHLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_free", // Important! Do not change this!!
            subscription_tier: SubscriptionTier.FREE,
        },
        {
            name: SubscriptionTier.ESSENTIALS,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$49",
            billing_period: BillingPeriod.MONTHLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: true,
            stripe_price_id: "price_1QVHLdK9e7MkYDNkhfVpBkz2",
            subscription_tier: SubscriptionTier.ESSENTIALS,
        },
        {
            name: SubscriptionTier.FOUNDERS,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$99",
            billing_period: BillingPeriod.MONTHLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_1QVHMLK9e7MkYDNk1hygYAxm",
            subscription_tier: SubscriptionTier.FOUNDERS,
        },
    ],
    annual: [
        {
            name: SubscriptionTier.FREE,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$0",
            billing_period: BillingPeriod.YEARLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_free", // Important! Do not change this!!
            subscription_tier: SubscriptionTier.FREE,
        },
        {
            name: SubscriptionTier.ESSENTIALS,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$490",
            billing_period: BillingPeriod.YEARLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: true,
            stripe_price_id: "price_1QVHLtK9e7MkYDNkoNZeCrgZ",
            subscription_tier: SubscriptionTier.ESSENTIALS,
        },
        {
            name: SubscriptionTier.FOUNDERS,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$990",
            billing_period: BillingPeriod.YEARLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_1QVHMjK9e7MkYDNklyysiqq5",
            subscription_tier: SubscriptionTier.FOUNDERS,
        },
    ],
    oneTime: [
        {
            name: SubscriptionTier.ESSENTIALS,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$999",
            billing_period: BillingPeriod.LIFETIME,
            billing_plan: BillingPlan.ONE_TIME,
            is_highlighted: false,
            stripe_price_id: "price_1QZDDyK9e7MkYDNkC91qiQl4",
            subscription_tier: SubscriptionTier.ESSENTIALS,
        },
        {
            name: SubscriptionTier.FOUNDERS,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$1,999",
            billing_period: BillingPeriod.LIFETIME,
            billing_plan: BillingPlan.ONE_TIME,
            is_highlighted: true,
            stripe_price_id: "price_1QZDEKK9e7MkYDNkb6N3GHrf",
            subscription_tier: SubscriptionTier.FOUNDERS,
        },
    ],
};

export const pricingCardFeatures: PricingFeatureSection[] = [
    {
        category: "Lorem Features",
        items: [
            {
                name: "Duis aute irure dolor",
                free: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Excepteur sint occaecat",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Cupidatat non proident",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Sunt in culpa qui",
                free: false,
                pro: false,
                enterprise: true,
            },
            {
                name: "Deserunt mollit anim",
                free: false,
                pro: false,
                enterprise: true,
            },
        ],
    },
    {
        category: "Ipsum Limits",
        items: [
            {
                name: "Consectetur Quota",
                free: "5",
                pro: "50",
                enterprise: "Unlimited",
            },
            {
                name: "Adipiscing Slots",
                free: "2",
                pro: "10",
                enterprise: "25",
            },
        ],
    },
];

export const defaultPricingFeatures: PricingFeatureSection[] = [
    {
        category: "Lorem",
        items: [
            {
                name: "Lorem ipsum dolor sit amet",
                free: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Consectetur adipiscing elit",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Sed do eiusmod tempor",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Ut labore et dolore",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Magna aliqua ut enim",
                free: false,
                pro: false,
                enterprise: true,
            },
        ],
    },
    {
        category: "Ipsum",
        items: [
            {
                name: "Minim veniam",
                free: "1 GB",
                pro: "50 GB",
                enterprise: "500 GB",
            },
            {
                name: "Quis nostrud exercitation",
                free: "10 GB",
                pro: "500 GB",
                enterprise: "Unlimited",
            },
            {
                name: "Ullamco laboris",
                free: "1",
                pro: "5",
                enterprise: "Unlimited",
            },
        ],
    },
];
