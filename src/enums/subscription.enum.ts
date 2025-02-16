export enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    TRIALING = "TRIALING",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
}

export enum SubscriptionTier {
    FREE = "FREE",
    ESSENTIALS = "ESSENTIALS",
    INDIE_HACKER = "INDIE_HACKER",
}

export enum BillingPlan {
    RECURRING = "RECURRING",
    ONE_TIME = "ONE_TIME",
}

export enum BillingPeriod {
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
    LIFETIME = "LIFETIME",
}
