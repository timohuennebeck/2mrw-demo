export enum BillingType {
    RECURRING = "RECURRING",
    ONE_TIME = "ONE_TIME",
}

export enum BillingPeriod {
    MONTH = "month",
    YEAR = "year",
    LIFETIME = "lifetime",
}

export interface DefaultPricingPlan {
    name: string;
    description: string;
    price: string;
    billing_period: BillingPeriod;
    billing_type: BillingType;
    is_highlighted: boolean;
    stripe_price_id: string;
    onClick: () => void;
}

export interface PricingFeatureSection {
    category: string;
    items: PricingFeatureItem[];
}

export interface PricingFeatureItem {
    name: string;
    free: boolean | string;
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
            name: "Free",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$0",
            billing_period: BillingPeriod.MONTH,
            billing_type: BillingType.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_free",
            onClick: () => {},
        },
        {
            name: "Pro",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$49",
            billing_period: BillingPeriod.MONTH,
            billing_type: BillingType.RECURRING,
            is_highlighted: true,
            stripe_price_id: "price_def456",
            onClick: () => {},
        },
        {
            name: "Enterprise",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$99",
            billing_period: BillingPeriod.MONTH,
            billing_type: BillingType.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_ghi789",
            onClick: () => {},
        },
    ],
    annual: [
        {
            name: "Free",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$0",
            billing_period: BillingPeriod.YEAR,
            billing_type: BillingType.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_free",
            onClick: () => {},
        },
        {
            name: "Pro",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$490",
            billing_period: BillingPeriod.YEAR,
            billing_type: BillingType.RECURRING,
            is_highlighted: true,
            stripe_price_id: "price_mno345",
            onClick: () => {},
        },
        {
            name: "Enterprise",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$990",
            billing_period: BillingPeriod.YEAR,
            billing_type: BillingType.RECURRING,
            is_highlighted: false,
            stripe_price_id: "price_pqr678",
            onClick: () => {},
        },
    ],
    oneTime: [
        {
            name: "Pro",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$999",
            billing_period: BillingPeriod.LIFETIME,
            billing_type: BillingType.ONE_TIME,
            is_highlighted: false,
            stripe_price_id: "price_lifetime_pro",
            onClick: () => {},
        },
        {
            name: "Enterprise",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            price: "$1,999",
            billing_period: BillingPeriod.LIFETIME,
            billing_type: BillingType.ONE_TIME,
            is_highlighted: true,
            stripe_price_id: "price_lifetime_ent",
            onClick: () => {},
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
