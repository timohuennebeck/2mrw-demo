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
    comingSoon?: boolean;
    [key: string]: any;
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
            stripe_price_id: "YOUR_STRIPE_PRICE_ID",
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
            stripe_price_id: "YOUR_STRIPE_PRICE_ID",
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
            stripe_price_id: "YOUR_STRIPE_PRICE_ID",
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
            stripe_price_id: "YOUR_STRIPE_PRICE_ID",
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
            stripe_price_id: "YOUR_STRIPE_PRICE_ID",
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
            stripe_price_id: "YOUR_STRIPE_PRICE_ID",
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
                [SubscriptionTier.FREE]: true,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.FOUNDERS]: true,
            },
            {
                name: "Excepteur sint occaecat",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.FOUNDERS]: true,
            },
            {
                name: "Cupidatat non proident",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.FOUNDERS]: true,
            },
            {
                name: "Sunt in culpa qui",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: false,
                [SubscriptionTier.FOUNDERS]: true,
            },
            {
                name: "Deserunt mollit anim",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: false,
                [SubscriptionTier.FOUNDERS]: true,
            },
        ],
    },
    {
        category: "Ipsum Limits",
        items: [
            {
                name: "Consectetur Quota",
                [SubscriptionTier.FREE]: "5",
                [SubscriptionTier.ESSENTIALS]: "50",
                [SubscriptionTier.FOUNDERS]: "Unlimited",
            },
            {
                name: "Adipiscing Slots",
                [SubscriptionTier.FREE]: "2",
                [SubscriptionTier.ESSENTIALS]: "10",
                [SubscriptionTier.FOUNDERS]: "25",
            },
        ],
    },
];

export const pricingComparisonFeatures: PricingFeatureSection[] = [
    {
        category: "Lorem",
        items: [
            {
                name: "Lorem ipsum dolor sit amet",
                [SubscriptionTier.FREE]: true,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.FOUNDERS]: true,
            },
            {
                name: "Consectetur adipiscing elit",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.FOUNDERS]: true,
            },
            {
                name: "Sed do eiusmod tempor",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.FOUNDERS]: true,
            },
            {
                name: "Ut labore et dolore",
                comingSoon: true,
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.FOUNDERS]: true,
            },
            {
                name: "Magna aliqua ut enim",
                comingSoon: true,
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: false,
                [SubscriptionTier.FOUNDERS]: true,
            },
        ],
    },
    {
        category: "Ipsum",
        items: [
            {
                name: "Minim veniam",
                [SubscriptionTier.FREE]: "1 GB",
                [SubscriptionTier.ESSENTIALS]: "50 GB",
                [SubscriptionTier.FOUNDERS]: "500 GB",
            },
            {
                name: "Quis nostrud exercitation",
                [SubscriptionTier.FREE]: "10 GB",
                [SubscriptionTier.ESSENTIALS]: "500 GB",
                [SubscriptionTier.FOUNDERS]: "Unlimited",
            },
            {
                name: "Ullamco laboris",
                comingSoon: true,
                [SubscriptionTier.FREE]: "1",
                [SubscriptionTier.ESSENTIALS]: "5",
                [SubscriptionTier.FOUNDERS]: "Unlimited",
            },
        ],
    },
];
