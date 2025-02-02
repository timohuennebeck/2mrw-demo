import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

/**
 * DYNAMIC: data that changes frequently such as user ugc content, etc.
 * STATIC: data that rarely changes such as premade audio clips, thumbnails, etc.
 */

export const CACHE_TIMES = {
    USER_CRITICAL: {
        staleTime: 1000 * 60 * 5, // 5 minutes - things like subscription status, free trial status, etc.
        cacheTime: 1000 * 60 * 30, // 30 minutes
    },
    DYNAMIC: {
        staleTime: 1000 * 60 * 30, // 30 minutes before background refresh
        cacheTime: 1000 * 60 * 60 * 2, // 2 hours
    },
    STATIC: {
        staleTime: 1000 * 60 * 60 * 24 * 8, // 8 days before background refresh
        cacheTime: 1000 * 60 * 60 * 24 * 32, // 32 days
    },
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: CACHE_TIMES.DYNAMIC.staleTime,
            gcTime: CACHE_TIMES.DYNAMIC.cacheTime,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
});

if (typeof window !== "undefined") {
    const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
        key: "app-cache",
    });

    persistQueryClient({
        queryClient,
        persister: localStoragePersister,
        buster: process.env.NEXT_PUBLIC_BUILD_VERSION, // when this id changes, the cache is invalidated
        maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    });
}
