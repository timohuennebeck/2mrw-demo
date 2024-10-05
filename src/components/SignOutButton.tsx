"use client";

import { createClient } from "@/services/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignOutButton = ({ title }: { title: string }) => {
    const router = useRouter();

    const supabase = createClient();

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error("Error signing out:", error.message);
                toast.error(`Error signing out: ${error.message}`);
            } else {
                toast.success("Logout successful!");

                router.replace("/auth/sign-in");
            }
        } catch (err) {
            console.error("Unexpected error during logout:", err);

            toast.error(`There has been an unexpected error: ${err}`);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            className={`w-full rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-neutral-100`}
        >
            {title}
        </button>
    );
};

export default SignOutButton;
