import { createClient } from "@supabase/supabase-js";

export const createSupabasePowerUserClient = async () => {
    return createClient(
        process.env.DB_SUPABASE_URL!,
        process.env.DB_SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        },
    );
};
