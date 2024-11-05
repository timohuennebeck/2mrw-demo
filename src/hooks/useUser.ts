import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/interfaces/UserInterfaces";
import { fetchUser } from "@/services/database/UserService";

export const useUser = (userId: string) => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchUser(userId ?? ""),
        enabled: !!userId,
    });

    const invalidateUser = () => {
        queryClient.invalidateQueries({ queryKey: ["user", userId] });
    };

    return {
        dbUser: data?.user as User,
        isLoading,
        invalidateUser,
    };
};

export default useUser;
