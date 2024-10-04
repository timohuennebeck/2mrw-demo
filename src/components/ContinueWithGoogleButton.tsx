import { signInUsingGoogle } from "@/app/auth/sign-in/action";
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
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            onClick={continueWithGoogle}
        >
            Continue with Google
        </button>
    );
}

export default ContinueWithGoogleButton;
