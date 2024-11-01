import { useSession } from "@/context/SessionContext";
import { fetchFreeTrial, fetchProducts, fetchSubscription } from "@/services/supabase/queries";
import { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const queryClient = new QueryClient();

const useUserInfoPreloader = () => {
    const { userIsLoggedIn, user } = useSession();

    useEffect(() => {
        const fetchInitialInformation = async () => {
            if (!userIsLoggedIn || !user) return;

            try {
                await Promise.all([
                    queryClient.prefetchQuery({
                        queryKey: ["products"],
                        queryFn: () => fetchProducts(),
                        staleTime: 5 * 60 * 1000,
                    }),
                    queryClient.prefetchQuery({
                        queryKey: ["freeTrial", user.id],
                        queryFn: () => fetchFreeTrial(user.id),
                    }),
                    queryClient.prefetchQuery({
                        queryKey: ["subscription", user.id],
                        queryFn: () => fetchSubscription(user.id),
                    }),
                ]);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialInformation();
    }, [userIsLoggedIn, user]);
};

export default useUserInfoPreloader;
