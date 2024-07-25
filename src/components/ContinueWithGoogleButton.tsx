"use client";

import { signInUsingGoogle } from "@/app/auth/sign-in/action";
import googleIcon from "@/assets/icons/google-icon.svg";
import Image from "next/image";
import { toast } from "sonner";

function ContinueWithGoogleButton() {
    const continueWithGoogle = async () => {
        const { success, error, redirect } = await signInUsingGoogle();

        if (error) {
            toast.error(error);
        }

        if (success && redirect) {
            window.location.href = redirect;

            toast("Redirecting to Google...");
        }
    };

    return (
        <button
            className="text-sm mt-4 w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2.5 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            onClick={continueWithGoogle}
        >
            <Image src={googleIcon} alt="Google Icon" className="size-6" />
            Continue with Google
        </button>
    );
}

export default ContinueWithGoogleButton;
