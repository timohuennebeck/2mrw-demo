import { signInUsingGoogle } from "@/app/auth/sign-in/action";
import { TextConstants } from "@/constants/TextConstants";
import { toast } from "sonner";

function ContinueWithGoogleButton() {
    const continueWithGoogle = async () => {
        const { success, error, redirect } = await signInUsingGoogle();

        if (error) {
            toast.error(error);
        }

        if (success && redirect) {
            window.location.href = redirect;

            toast(TextConstants.TEXT__REDIRECTING_TO_GOOGLE);
        }
    };

    return (
        <button
            className="flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm transition-colors outline-none border hover:bg-neutral-100 font-medium"
            onClick={continueWithGoogle}
        >
            Continue with Google
        </button>
    );
}

export default ContinueWithGoogleButton;
