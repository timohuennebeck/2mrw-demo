"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { createClient } from "@/services/integration/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { ProfileSection } from "./ProfileSection";

export const DeleteProfileSection = () => {
    const { authUser } = useSession();

    const router = useRouter();

    const supabase = createClient();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteProfile = async () => {
        setIsDeleting(true);

        try {
            const { error: dbError } = await supabase.from("users").delete().eq("id", authUser?.id);

            if (dbError) throw dbError;

            const { error: authError } = await supabase.auth.admin.deleteUser(authUser?.id ?? "");

            if (authError) throw authError;

            toast.success("Your profile has been deleted");
            router.push("/auth/signin");
            setIsDeleting(false);
        } catch (error) {
            toast.error("Failed to delete profile");
            setIsDeleting(false);
        }
    };

    return (
        <ProfileSection
            title="Delete Profile"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        >
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete Profile"}
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
