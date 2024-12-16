export const cacheConfig = {
    TTL_SUBSCRIPTION: 5 * 60, // 5 minutes in seconds
    CACHE_PREFIX: {
        USER_SUBSCRIPTION: "user_sub:", // prefix for redis keys
    },
} as const;
