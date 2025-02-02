import { fetchReferrals } from "@/services/database/referral-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useSession } from "./session-context";
import { Referral } from "@/interfaces";

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
        queryKey: ["referrals"],
        queryFn: () => fetchReferrals(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    const invalidateReferrals = () => {
        queryClient.invalidateQueries({ queryKey: ["referrals"] });
    };

    return (
        <ReferralContext.Provider
            value={{ referrals: data?.referrals ?? null, invalidateReferrals }}
        >
            {children}
        </ReferralContext.Provider>
    );
};

export const useReferral = () => useContext(ReferralContext);
