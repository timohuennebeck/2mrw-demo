import { fetchReferrals } from "@/services/database/referral-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useSession } from "./session-context";
import { Referral } from "@/interfaces";
import { CACHE_KEYS } from "@/constants/caching-constants";

interface ReferralContextType {
    referrals: Referral[] | null;
    invalidateReferrals: () => void;
}

const ReferralContext = createContext({
    referrals: null,
    invalidateReferrals: () => {},
} as ReferralContextType);

export const ReferralProvider = ({ children }: { children: React.ReactNode }) => {
    const { authUser } = useSession();

    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: CACHE_KEYS.USER_CRITICAL.REFERRALS(authUser?.id ?? ""),
        queryFn: () => fetchReferrals(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    return (
        <ReferralContext.Provider
            value={{
                referrals: data?.referrals ?? null,
                invalidateReferrals: () => {
                    queryClient.invalidateQueries({
                        queryKey: CACHE_KEYS.USER_CRITICAL.REFERRALS(authUser?.id ?? ""),
                    });
                },
            }}
        >
            {children}
        </ReferralContext.Provider>
    );
};

export const useReferral = () => useContext(ReferralContext);
