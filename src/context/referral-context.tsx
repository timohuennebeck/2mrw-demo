import { CACHE_KEYS } from "@/constants/caching-constants";
import { Referral } from "@/interfaces";
import { fetchReferrals } from "@/services/database/referral-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useUser } from "./user-context";

interface ReferralContextType {
    referrals: Referral[] | null;
    invalidateReferrals: () => Promise<void>;
}

const ReferralContext = createContext({
    referrals: null,
    invalidateReferrals: () => {},
} as ReferralContextType);

export const ReferralProvider = ({ children }: { children: React.ReactNode }) => {
    const { dbUser } = useUser();

    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: CACHE_KEYS.USER_CRITICAL.REFERRALS(dbUser?.id ?? ""),
        queryFn: () => fetchReferrals(dbUser?.id ?? ""),
        enabled: !!dbUser?.id,
    });

    return (
        <ReferralContext.Provider
            value={{
                referrals: data?.referrals ?? null,
                invalidateReferrals: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: CACHE_KEYS.USER_CRITICAL.REFERRALS(dbUser?.id ?? ""),
                    });
                },
            }}
        >
            {children}
        </ReferralContext.Provider>
    );
};

export const useReferral = () => useContext(ReferralContext);
