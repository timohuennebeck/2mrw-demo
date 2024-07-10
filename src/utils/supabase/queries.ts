import supabase from "@/lib/supabaseClient";

interface UserExists {
    userEmail: string;
}

export const checkUserExists = async ({ userEmail }: UserExists) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select()
            .eq("email", userEmail)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                // means that no match was found
                return null;
            }

            // triggered when some other error occurs
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error checking user existence:", error);
        throw error;
    }
};
