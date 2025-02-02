import { createClient } from "@/services/integration/client";
import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SessionContextType {
    authUserIsLoggedIn: boolean;
    authUser: User | null;
}

const SessionContext = createContext({
    authUserIsLoggedIn: false,
    authUser: null,
} as SessionContextType);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [authUserIsLoggedIn, setAuthUserIsLoggedIn] = useState(false);
    const [authUser, setAuthUser] = useState<User | null>(null);

    useEffect(() => {
        const supabaseClient = createClient();

        const checkUser = async () => {
            const {
                data: { user },
            } = await supabaseClient.auth.getUser();

            setAuthUserIsLoggedIn(!!user);
            setAuthUser(user);
        };

        checkUser();

        const { data: authListener } = supabaseClient.auth.onAuthStateChange((_, session) => {
            setAuthUserIsLoggedIn(!!session);
            setAuthUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <SessionContext.Provider value={{ authUserIsLoggedIn, authUser }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
