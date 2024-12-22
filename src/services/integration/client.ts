import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
    return createBrowserClient(
        process.env.DB_SUPABASE_URL!,
        process.env.DB_SUPABASE_ANON_KEY!,
    );
};
