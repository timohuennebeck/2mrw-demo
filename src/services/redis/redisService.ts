import { cacheConfig } from "@/config";
import { PurchasedSubscription, User } from "@/interfaces";
import { redis } from "./client";

export const getCachedUser = async (userId: string) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER;
        const cacheKey = `${cachePrefix}${userId}`;
        const cachedData = await redis.get(cacheKey);

        return { data: cachedData as User, error: null };
    } catch (error) {
        console.error("Failed to get cached user:", error);
        return { data: null, error };
    }
};

export const setCachedUser = async (userId: string, data: any) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER;
        const cacheKey = `${cachePrefix}${userId}`;
        await redis.set(cacheKey, data, { ex: cacheConfig.TTL_USER });

        return { success: true, error: null };
    } catch (error) {
        console.error("Failed to set cached user:", error);
        return { success: false, error };
    }
};

export const invalidateUserCache = async (userId: string) => {
    try {
        const cachePrefix = cacheConfig.CACHE_PREFIX.USER;
        const cacheKey = `${cachePrefix}${userId}`;
        await redis.del(cacheKey);

        return { success: true, error: null };
    } catch (error) {
        console.error("Failed to invalidate user cache:", error);
        return { success: false, error };
    }
};

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
