"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSession } from "@/context/SessionContext";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/services/integration/client";
import { TextConstants } from "@/constants/TextConstants";
import { validateEmailFormat } from "@/utils/validators/formatValidator";
import { useUser } from "@/context/UserContext";
import FormHeader from "@/components/application/FormHeader";
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

    const [isUpdatingPersonalInfo, setIsUpdatingPersonalInfo] = useState(false);

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

    return (
        <div className="container h-full max-w-3xl bg-white">
            <FormHeader
                title="Personal Profile"
                isPageHeader
                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
            />

            <div className="space-y-6">
                <Form {...profileForm}>
                    <form
                        onSubmit={profileForm.handleSubmit(handlePersonalInfoSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={profileForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
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
                        >
                            {isUpdatingPersonalInfo ? "Updating..." : "Update Profile"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default UserProfilePage;
