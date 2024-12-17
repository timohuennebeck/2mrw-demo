import { cacheConfig } from "@/config";
import { redis } from "./client";
import { PurchasedSubscription } from "@/interfaces";
import { FreeTrial } from "@/interfaces/models/freeTrial";

export const getCachedSubscription = async (userId: string) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER_SUBSCRIPTION;
        const cacheKey = `${cachePrefix}${userId}`;
        const cachedData = await redis.get(cacheKey);

        return { data: cachedData as PurchasedSubscription, error: null };
    } catch (error) {
        console.error("Failed to get cached subscription:", error);
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
        console.error("Failed to set cached subscription:", error);
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
        console.error("Failed to invalidate subscription cache:", error);
        return { success: false, error };
    }
};

export const getCachedFreeTrial = async (userId: string) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER_FREE_TRIAL;
        const cacheKey = `${cachePrefix}${userId}`;
        const cachedData = await redis.get(cacheKey);

        return { data: cachedData as FreeTrial, error: null };
    } catch (error) {
        console.error("Failed to get cached free trial:", error);
        return { data: null, error };
    }
};

export const setCachedFreeTrial = async (userId: string, data: any) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER_FREE_TRIAL;
        const cacheKey = `${cachePrefix}${userId}`;
        await redis.set(cacheKey, data, { ex: cacheConfig.TTL_FREE_TRIAL });

        return { success: true, error: null };
    } catch (error) {
        console.error("Failed to set cached free trial:", error);
        return { success: false, error };
    }
};

export const invalidateFreeTrialCache = async (userId: string) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER_FREE_TRIAL;
        const cacheKey = `${cachePrefix}${userId}`;
        await redis.del(cacheKey);

        return { success: true, error: null };
    } catch (error) {
        console.error("Failed to invalidate free trial cache:", error);
        return { success: false, error };
    }
};
