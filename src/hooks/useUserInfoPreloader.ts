import { useSession } from "@/context/SessionContext";
import { fetchUserFreeTrial, fetchUserSubscription } from "@/services/supabase/queries";
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
                        queryKey: ["freeTrial", user.id],
                        queryFn: () => fetchUserFreeTrial(user.id),
                    }),
                    queryClient.prefetchQuery({
                        queryKey: ["subscription", user.id],
                        queryFn: () => fetchUserSubscription(user.id),
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
