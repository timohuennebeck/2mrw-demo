export const CACHE_KEYS = {
    USER_CRITICAL: {
        USER: (userId: string) => ["user", userId],
        SUBSCRIPTION: (userId: string) => ["subscription", userId],
        FREE_TRIAL: (userId: string) => ["freeTrial", userId],

        REFERRALS: (userId: string) => ["referrals", userId],
        CLAIMED_REWARDS: (userId: string) => ["claimedRewards", userId],
    },
};
