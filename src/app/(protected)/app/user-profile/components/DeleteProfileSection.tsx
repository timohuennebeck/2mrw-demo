"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { isOneTimePaymentEnabled } from "@/config";
import { useSession } from "@/context/SessionContext";
import { EmailType } from "@/enums/email";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
import { createClient } from "@/services/integration/client";
import { sendLoopsTransactionalEmail } from "@/services/loops/loopsService";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cancelStripeSubscription } from "./actions";
import { ProfileSection } from "./ProfileSection";

const _cancelExistingSubscriptionInStripe = async (userId: string) => {
    try {
        const result = await cancelStripeSubscription(userId);
        if (!result.success) {
            console.error("Error cancelling subscription:", result.error);
        }
    } catch (error) {
        console.error("Error cancelling subscription:", error);
    }
};

const _deleteUserProfile = async (authUser: User) => {
    const adminSupabase = await createSupabasePowerUserClient();

    if (!isOneTimePaymentEnabled()) {
        await _cancelExistingSubscriptionInStripe(authUser?.id ?? "");
    }

    const { error: dbError } = await adminSupabase.from("users").delete().eq("id", authUser?.id);
    if (dbError) return { error: "Error deleting user profile from database" };

    const { error: authError } = await adminSupabase.auth.admin.deleteUser(authUser?.id ?? "");
    if (authError) return { error: "Error deleting user profile from auth" };

    return { success: true };
};

export const DeleteProfileSection = () => {
    const { authUser } = useSession();

    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteProfile = async () => {
        setIsDeleting(true);

        try {
            sendLoopsTransactionalEmail({
                type: EmailType.DELETED_PROFILE,
                email: authUser?.email ?? "",
                variables: {},
            });

            const result = await _deleteUserProfile(authUser as User);

            if (result.error) {
                toast.error(result.error);
                setIsDeleting(false);
            } else {
                const supabase = createClient();
                await supabase.auth.signOut();

                // wait for a brief moment to ensure cookies are cleared
                await new Promise((resolve) => setTimeout(resolve, 500));

                router.replace("/auth/sign-up?feedback=account-deleted");

                // wait for a brief moment to create a smooth transition
                setTimeout(() => {
                    setIsDeleting(false);
                }, 500);
            }
        } catch (error) {
            toast.error("Failed to delete user profile");
        }
    };

    return (
        <ProfileSection
            title="Delete Profile"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        >
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        isLoading={isDeleting}
                    >
                        Delete Profile
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Lorem ipsum dolor sit amet.</AlertDialogTitle>
                        <AlertDialogDescription>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium
                            vero nulla nihil totam dolorem. Perspiciatis?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProfile}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Profile
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ProfileSection>
    );
};
