import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/services/supabase-clients/client";

interface SessionContextType {
    authUserIsLoggedIn: boolean;
    authUser: User | null;
}

const SessionContext = createContext({
    authUserIsLoggedIn: false,
    authUser: null,
} as SessionContextType);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();

    const supabaseClient = createClient();

    const { data } = useQuery({
        queryKey: ["session"],
        queryFn: async () => {
            const {
                data: { user },
            } = await supabaseClient.auth.getUser();
            return user;
        },
        refetchOnWindowFocus: true,
    });

    useQuery({
        queryKey: ["authListener"],
        queryFn: () => {
            const { data: authListener } = supabaseClient.auth.onAuthStateChange((_, session) => {
                queryClient.setQueryData(["session"], session?.user ?? null);
            });

            return () => {
                authListener.subscription.unsubscribe();
            };
        },
        refetchOnWindowFocus: false,
    });

    return (
        <SessionContext.Provider
            value={{
                authUserIsLoggedIn: !!data,
                authUser: data ?? null,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
