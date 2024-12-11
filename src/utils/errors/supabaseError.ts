export const handleSupabaseError = (error: unknown, fnTitle: string) => {
    console.error(`Supabase error in: ${fnTitle}`, error);

    return { error };
};
