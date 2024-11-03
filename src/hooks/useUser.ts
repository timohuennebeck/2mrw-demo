import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser } from "@/services/supabase/queries";
import { User } from "@/interfaces/UserInterfaces";

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
