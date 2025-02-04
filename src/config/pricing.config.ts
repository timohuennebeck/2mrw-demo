import { BillingPeriod, BillingPlan, SubscriptionTier } from "@/enums";
import { removeUnderscore } from "@/utils/text/text-helper";

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
    tooltip?: string;
    [key: string]: any;
}

const FREE_STRIPE_PRICE_INDICATOR = "price_free"; // Important! Do not change this as this is responsible for handling the FREE plan throughout the app!!

export const defaultPricingPlans: {
    monthly: DefaultPricingPlan[];
    annual: DefaultPricingPlan[];
    oneTime: DefaultPricingPlan[];
} = {
    monthly: [
        {
            name: SubscriptionTier.FREE,
            description:
                "This is the description of the FREE plan and can be modified.",
            price: "$0",
            billing_period: BillingPeriod.MONTHLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: false,
            stripe_price_id: FREE_STRIPE_PRICE_INDICATOR,
            subscription_tier: SubscriptionTier.FREE,
        },
        {
            name: SubscriptionTier.ESSENTIALS,
            description:
                "This is the description of the ESSENTIALS plan and can be modified.",
            price: "$49",
            billing_period: BillingPeriod.MONTHLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: true,
            stripe_price_id: "price_1QVHLdK9e7MkYDNkhfVpBkz2",
            subscription_tier: SubscriptionTier.ESSENTIALS,
        },
        {
            name: removeUnderscore(SubscriptionTier.INDIE_HACKER),
            description:
                "This is the description of the INDIE_HACKER plan and can be modified.",
            price: "$99",
            billing_period: BillingPeriod.MONTHLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_1QVHMLK9e7MkYDNk1hygYAxm",
            subscription_tier: SubscriptionTier.INDIE_HACKER,
        },
    ],
    annual: [
        {
            name: SubscriptionTier.FREE,
            description:
                "This is the description of the FREE plan and can be modified.",
            price: "$0",
            billing_period: BillingPeriod.YEARLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: false,
            stripe_price_id: FREE_STRIPE_PRICE_INDICATOR, // Important! Do not change this!!
            subscription_tier: SubscriptionTier.FREE,
        },
        {
            name: SubscriptionTier.ESSENTIALS,
            description:
                "This is the description of the ESSENTIALS plan and can be modified.",
            price: "$490",
            billing_period: BillingPeriod.YEARLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: true,
            stripe_price_id: "price_1QVHLtK9e7MkYDNkoNZeCrgZ",
            subscription_tier: SubscriptionTier.ESSENTIALS,
        },
        {
            name: removeUnderscore(SubscriptionTier.INDIE_HACKER),
            description:
                "This is the description of the INDIE_HACKER plan and can be modified.",
            price: "$990",
            billing_period: BillingPeriod.YEARLY,
            billing_plan: BillingPlan.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_1QVHMjK9e7MkYDNklyysiqq5",
            subscription_tier: SubscriptionTier.INDIE_HACKER,
        },
    ],
    oneTime: [
        {
            name: SubscriptionTier.ESSENTIALS,
            description:
                "This is the description of the ESSENTIALS plan and can be modified.",
            price: "$999",
            billing_period: BillingPeriod.LIFETIME,
            billing_plan: BillingPlan.ONE_TIME,
            is_highlighted: false,
            stripe_price_id: "price_1QZDDyK9e7MkYDNkC91qiQl4",
            subscription_tier: SubscriptionTier.ESSENTIALS,
        },
        {
            name: removeUnderscore(SubscriptionTier.INDIE_HACKER),
            description:
                "This is the description of the INDIE_HACKER plan and can be modified.",
            price: "$1,999",
            billing_period: BillingPeriod.LIFETIME,
            billing_plan: BillingPlan.ONE_TIME,
            is_highlighted: true,
            stripe_price_id: "price_1QZDEKK9e7MkYDNkb6N3GHrf",
            subscription_tier: SubscriptionTier.INDIE_HACKER,
        },
    ],
};

export const pricingCardFeatures: PricingFeatureItem[] = [
    {
        name: "Duis aute irure dolor",
        [SubscriptionTier.FREE]: true,
        [SubscriptionTier.ESSENTIALS]: true,
        [SubscriptionTier.INDIE_HACKER]: true,
    },
    {
        name: "Excepteur sint occaecat",
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.ESSENTIALS]: true,
        [SubscriptionTier.INDIE_HACKER]: true,
    },
    {
        name: "Cupidatat non proident",
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.ESSENTIALS]: true,
        [SubscriptionTier.INDIE_HACKER]: true,
    },
    {
        name: "Sunt in culpa qui",
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.ESSENTIALS]: false,
        [SubscriptionTier.INDIE_HACKER]: true,
    },
    {
        name: "Deserunt mollit anim",
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.ESSENTIALS]: false,
        [SubscriptionTier.INDIE_HACKER]: true,
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
                [SubscriptionTier.INDIE_HACKER]: true,
            },
            {
                name: "Consectetur adipiscing elit",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.INDIE_HACKER]: true,
            },
            {
                name: "Sed do eiusmod tempor",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.INDIE_HACKER]: true,
            },
            {
                name: "Ut labore et dolore",
                comingSoon: true,
                tooltip:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: true,
                [SubscriptionTier.INDIE_HACKER]: true,
            },
            {
                name: "Magna aliqua ut enim",
                comingSoon: true,
                tooltip:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                [SubscriptionTier.FREE]: false,
                [SubscriptionTier.ESSENTIALS]: false,
                [SubscriptionTier.INDIE_HACKER]: true,
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
                [SubscriptionTier.INDIE_HACKER]: "500 GB",
            },
            {
                name: "Quis nostrud exercitation",
                [SubscriptionTier.FREE]: "10 GB",
                [SubscriptionTier.ESSENTIALS]: "500 GB",
                [SubscriptionTier.INDIE_HACKER]: "Unlimited",
            },
            {
                name: "Ullamco laboris",
                comingSoon: true,
                [SubscriptionTier.FREE]: "1",
                [SubscriptionTier.ESSENTIALS]: "5",
                [SubscriptionTier.INDIE_HACKER]: "Unlimited",
            },
        ],
    },
];
