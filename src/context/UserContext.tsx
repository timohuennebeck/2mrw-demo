import { fetchUser } from "@/services/database/userService";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useSession } from "./SessionContext";
import { User } from "@/interfaces";

interface UserContextType {
    dbUser: User | null;
}

const UserContext = createContext<UserContextType>({
    dbUser: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { authUser } = useSession();

    const { data } = useQuery({
        queryKey: ["user"],
        queryFn: () => fetchUser(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    return (
        <UserContext.Provider value={{ dbUser: data?.user ?? null }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
