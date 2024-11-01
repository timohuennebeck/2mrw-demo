import { useSession } from "@/context/SessionContext";
import { queryClient } from "@/lib/qClient/qClient";
import { fetchUserFreeTrial, fetchUserSubscription } from "@/services/supabase/queries";
import { useEffect } from "react";

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
