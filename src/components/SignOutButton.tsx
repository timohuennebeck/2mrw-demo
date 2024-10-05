"use client";

import { TextConstants } from "@/constants/TextConstants";
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
                toast.error(`${TextConstants.ERROR_SIGNING_OUT}: ${error.message}`);
            } else {
                toast.success(TextConstants.TEXT__LOGOUT_SUCCESSFUL);

                router.replace("/auth/sign-in");
            }
        } catch (err) {
            toast.error(`${TextConstants.ERROR__UNEXPECTED_ERROR} ${err}`);
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
