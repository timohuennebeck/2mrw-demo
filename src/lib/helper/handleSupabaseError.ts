export const handleSupabaseError = (error: unknown) => {
    console.error("Supabase error:", error);

    return { error };
};