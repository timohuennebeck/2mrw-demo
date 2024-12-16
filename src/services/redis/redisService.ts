import { cacheConfig } from "@/config/cacheConfig";
import { redis } from "./client";
import { PurchasedSubscription } from "@/interfaces";

export const getCachedSubscription = async (userId: string) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER_SUBSCRIPTION;
        const cacheKey = `${cachePrefix}${userId}`;
        const cachedData = await redis.get(cacheKey);

        return { data: cachedData as PurchasedSubscription, error: null };
    } catch (error) {
        console.error("Cache error:", error);
        return { data: null, error };
    }
};

export const setCachedSubscription = async (userId: string, data: any) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER_SUBSCRIPTION;
        const cacheKey = `${cachePrefix}${userId}`;
        await redis.set(cacheKey, data, { ex: cacheConfig.TTL_SUBSCRIPTION });

        return { success: true, error: null };
    } catch (error) {
        console.error("Cache error:", error);
        return { success: false, error };
    }
};

export const invalidateSubscriptionCache = async (userId: string) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER_SUBSCRIPTION;
        const cacheKey = `${cachePrefix}${userId}`;
        await redis.del(cacheKey);

        return { success: true, error: null };
    } catch (error) {
        console.error("Cache invalidation error:", error);
        return { success: false, error };
    }
};
