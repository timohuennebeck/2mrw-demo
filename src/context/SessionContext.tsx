import { createClient } from "@/services/supabase/client";
import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SessionContextType {
    userIsLoggedIn: boolean;
    user: User | null;
}

const SessionContext = createContext<SessionContextType>({
    userIsLoggedIn: false,
    user: null,
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabaseClient = createClient();

        const checkUser = async () => {
            const {
                data: { user },
            } = await supabaseClient.auth.getUser();

            setUserIsLoggedIn(!!user);
            setUser(user);
        };

        checkUser();

        const { data: authListener } = supabaseClient.auth.onAuthStateChange((_, session) => {
            setUserIsLoggedIn(!!session);
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <SessionContext.Provider value={{ userIsLoggedIn, user }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
