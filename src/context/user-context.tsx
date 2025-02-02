import { fetchUser } from "@/services/database/user-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useSession } from "./session-context";
import { User } from "@/interfaces";
import { CACHE_KEYS } from "@/constants/caching-constants";

interface UserContextType {
    dbUser: User | null;
    invalidateUser: () => void;
}

const UserContext = createContext({
    dbUser: null,
    invalidateUser: () => {},
} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { authUser } = useSession();

    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: CACHE_KEYS.USER_CRITICAL.USER(authUser?.id ?? ""),
        queryFn: () => fetchUser(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    return (
        <UserContext.Provider
            value={{
                dbUser: data?.data ?? null,
                invalidateUser: () => {
                    queryClient.invalidateQueries({
                        queryKey: CACHE_KEYS.USER_CRITICAL.USER(authUser?.id ?? ""),
                    });
                },
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
