import { fetchUser } from "@/services/database/userService";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useSession } from "./SessionContext";
import { User } from "@/interfaces";
import { queryClient } from "@/lib/qClient/qClient";

interface UserContextType {
    dbUser: User | null;
    invalidateUser: () => void;
}

const UserContext = createContext<UserContextType>({
    dbUser: null,
    invalidateUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { authUser } = useSession();

    const { data } = useQuery({
        queryKey: ["user"],
        queryFn: () => fetchUser(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    const invalidateUser = () => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
    };

    return (
        <UserContext.Provider value={{ dbUser: data?.user ?? null, invalidateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
