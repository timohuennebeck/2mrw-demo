import { SubscriptionTier } from "@/enums/SubscriptionTier";

interface Feature {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    availableIn: SubscriptionTier[];
}

export const FEATURES = {
    CUSTOM_DOMAIN: {
        id: "custom-domain",
        name: "Custom domain",
        description: "Lorem ipsum dolor sit amet",
        enabled: true,
        availableIn: [
            SubscriptionTier.FREE,
            SubscriptionTier.ESSENTIALS,
            SubscriptionTier.FOUNDERS,
        ],
    } as Feature,

    DATABASE_ACCESS: {
        id: "database-access",
        name: "Database access",
        description: "Lorem ipsum dolor sit amet",
        enabled: true,
        availableIn: [SubscriptionTier.ESSENTIALS, SubscriptionTier.FOUNDERS],
    } as Feature,

    SSL_CERTIFICATE: {
        id: "ssl-certificate",
        name: "SSL Certificate",
        description: "Lorem ipsum dolor sit amet",
        enabled: true,
        availableIn: [SubscriptionTier.ESSENTIALS, SubscriptionTier.FOUNDERS],
    } as Feature,

    UNLIMITED_STORAGE: {
        id: "unlimited-storage",
        name: "Unlimited Storage",
        description: "Lorem ipsum dolor sit amet",
        enabled: true,
        availableIn: [SubscriptionTier.ESSENTIALS, SubscriptionTier.FOUNDERS],
    } as Feature,

    DEDICATED_SUPPORT: {
        id: "dedicated-support",
        name: "24/7 Support",
        description: "Lorem ipsum dolor sit amet",
        enabled: true,
        availableIn: [SubscriptionTier.FOUNDERS],
    } as Feature,
} as const;
