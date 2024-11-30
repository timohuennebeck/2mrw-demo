"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSession } from "@/context/SessionContext";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/services/integration/client";
import { TextConstants } from "@/constants/TextConstants";
import { validateEmailFormat } from "@/utils/validators/formatValidator";
import { useUser } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { v4 as uuidv4 } from "uuid";

const _updateUserName = async (userId: string, firstName: string) => {
    const supabase = createClient();

    const { error } = await supabase
        .from("users")
        .update({
            first_name: firstName,
        })
        .eq("id", userId);

    const { error: authError } = await supabase.auth.updateUser({
        data: {
            full_name: firstName,
        },
    });

    if (error || authError) {
        return { error: "Error updating first name" };
    }
};

const _updateProfilePicture = async (userId: string, file: File) => {
    const supabase = createClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(fileName, file);

    if (uploadError) return { error: "Error uploading image" };

    const {
        data: { publicUrl },
    } = supabase.storage.from("profile_images").getPublicUrl(fileName);

    const { error: updateError } = await supabase
        .from("users")
        .update({ profile_image_url: publicUrl })
        .eq("id", userId);

    if (updateError) return { error: "Error updating profile picture" };

    return { publicUrl };
};

const profileFormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().email(),
});

const UserProfilePage = () => {
    const { authUser } = useSession();
    const { dbUser } = useUser();

    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");

    const [isUpdatingPersonalInfo, setIsUpdatingPersonalInfo] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const hasShownToastRef = useRef(false);

    useEffect(() => {
        const message = searchParams.get("message");
        if (message === "email-updated" && !hasShownToastRef.current) {
            // prevent the toast from being shown multiple times due to useEffect being triggered multiple times
            hasShownToastRef.current = true;
            // requires a timeout to ensure the toast doesn't get lost in the render cycle
            setTimeout(() => {
                toast.success("Your email has been updated");
            }, 100);
            router.replace("/user-profile", { scroll: false });
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (dbUser) {
            setFirstName(dbUser.first_name);
            setEmail(dbUser.email);
            setProfileImageUrl(dbUser.profile_image_url);
        }
    }, [dbUser]);

    const profileForm = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: "",
            email: "",
        },
    });

    const handlePersonalInfoSubmit = async () => {
        if (!validateEmailFormat(email)) {
            toast.error(TextConstants.ERROR__INVALID_EMAIL);
            return;
        }

        setIsUpdatingPersonalInfo(true);

        if (email !== dbUser?.email) {
            /**
             * sends a confirmation email to the new email address
             * the user will have to click on the link in the email and will be redirect to /auth/confirm
             * which will then verify his credentials and afterwards update the email in supabase
             */

            const { error } = await supabase.auth.updateUser({
                email: email,
            });
            setIsUpdatingPersonalInfo(false);
            toast.info("To update the email, please confirm in the email we just sent.");

            if (error) {
                setIsUpdatingPersonalInfo(false);
                toast.error(error.message);
            }
        }

        if (firstName !== dbUser?.first_name) {
            const result = await _updateUserName(authUser?.id ?? "", firstName);

            if (result?.error) {
                setIsUpdatingPersonalInfo(false);
                toast.error(result.error);
            } else {
                setIsUpdatingPersonalInfo(false);
                toast.success("Your name has been updated!");
            }
        }
    };

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

    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        const result = await _updateProfilePicture(authUser?.id ?? "", file);

        console.log("→ [LOG] result", result);

        if (result.error) {
            toast.error(result.error);
        } else {
            setProfileImageUrl(result.publicUrl ?? "");
            toast.success("Profile picture updated successfully!");
        }
    };

    return (
        <div className="container h-full max-w-3xl bg-white">
            <div className="mb-8">
                <div className="flex flex-row items-center gap-4">
                    <Avatar className="h-24 w-24 rounded-none">
                        <AvatarImage src={profileImageUrl} className="rounded-none" />
                        <AvatarFallback className="rounded-none">
                            {firstName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                        id="profile-picture-input"
                    />
                    <Button
                        type="button"
                        onClick={() => document.getElementById("profile-picture-input")?.click()}
                        className="w-fit rounded-none"
                        size="sm"
                    >
                        Upload Profile Picture
                    </Button>
                </div>
            </div>

            <Form {...profileForm}>
                <form
                    onSubmit={profileForm.handleSubmit(handlePersonalInfoSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        className="rounded-none"
                                        placeholder="shadcn"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        className="rounded-none"
                                        type="email"
                                        placeholder="m@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        disabled={isUpdatingPersonalInfo}
                        className="self-start rounded-none"
                    >
                        {isUpdatingPersonalInfo ? "Updating..." : "Update Profile"}
                    </Button>
                </form>
            </Form>

            <div className="mt-8 border-t pt-8">
                <h2 className="mb-2 text-sm font-semibold">Delete Profile</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut voluptas rem quam,
                    facere sequi error?
                </p>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-none"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Profile"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Lorem ipsum dolor sit amet.</AlertDialogTitle>
                            <AlertDialogDescription>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                                Accusantium vero nulla nihil totam dolorem. Perspiciatis?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteProfile}
                                className="rounded-none bg-red-600 hover:bg-red-700"
                            >
                                Delete Account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default UserProfilePage;
