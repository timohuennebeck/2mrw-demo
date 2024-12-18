export const cacheConfig = {
    TTL_SUBSCRIPTION: 5 * 60, // 5 minutes in seconds
    TTL_FREE_TRIAL: 5 * 60,
    TTL_USER: 5 * 60,
    CACHE_PREFIX: {
        USER_SUBSCRIPTION: "user_sub:", // prefix for redis keys
        USER_FREE_TRIAL: "user_trial:",
        USER: "user:",
    },
} as const;
