import { createClient } from "@/services/supabase/client";
import { useEffect } from "react";

interface UseSupabaseRealtimeProps {
    table: string;
    filter?: string;
    onChange: () => void;
}

export const useSupabaseRealtime = ({ table, filter, onChange }: UseSupabaseRealtimeProps) => {
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel(`${table}-changes`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table,
                    ...(filter && { filter }),
                },
                onChange,
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table, filter, onChange]);
};
