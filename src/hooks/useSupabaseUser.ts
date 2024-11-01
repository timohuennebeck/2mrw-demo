import { useQuery } from "@tanstack/react-query";
import { fetchSupabaseUser } from "@/services/supabase/queries";

export const useSupabaseUser = () => {
    return useQuery({
        queryKey: ["supabaseUser"],
        queryFn: () => fetchSupabaseUser(),
        staleTime: 5 * 60 * 1000,
    });
};

export default useSupabaseUser;
