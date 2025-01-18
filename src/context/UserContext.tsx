import { fetchUser } from "@/services/database/userService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useSession } from "./SessionContext";
import { User } from "@/interfaces";

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
        queryKey: ["user"],
        queryFn: () => fetchUser(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    const invalidateUser = () => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
    };

    return (
        <UserContext.Provider value={{ dbUser: data?.data ?? null, invalidateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
