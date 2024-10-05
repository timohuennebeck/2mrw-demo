"use client";

import { createClient } from "@/services/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignOutButton = ({ title, disabled }: { title: string; disabled?: boolean }) => {
    const router = useRouter();

    const supabase = createClient();

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error("Error signing out:", error.message);
                toast.error(`Error signing out: ${error.message}`);
            } else {
                toast.success("Sign out successful!");

                router.replace("/auth/sign-in");
            }
        } catch (err) {
            console.error("Unexpected error during sign out:", err);

            toast.error(`There has been an unexpected error: ${err}`);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={disabled}
            className={`
                w-full py-2.5 px-4 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
                ${
                    disabled
                        ? "bg-neutral-300 text-neutral-500 cursor-not-allowed opacity-60"
                        : "bg-black text-white hover:bg-neutral-800 focus:ring-neutral-900"
                }
            `}
        >
            {title}
        </button>
    );
};

export default SignOutButton;
