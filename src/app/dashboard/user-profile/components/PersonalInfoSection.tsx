"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "@/context/SessionContext";
import { createClient } from "@/services/integration/client";
import { TextConstants } from "@/constants/TextConstants";
import { validateEmailFormat } from "@/utils/validators/formatValidator";
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
import { ProfileSection } from "./ProfileSection";
import { z } from "zod";
import { useUser } from "@/context/UserContext";

const _profileFormSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    email: z.string().email(),
    position: z.string().max(50).optional(),
    bio: z.string().max(160).optional(),
});

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

export const PersonalInfoSection = () => {
    const { authUser } = useSession();
    const { dbUser } = useUser();

    const supabase = createClient();

    const [bioCharactersLeft, setBioCharactersLeft] = useState(160);
    const [isUpdatingPersonalInfo, setIsUpdatingPersonalInfo] = useState(false);

    const form = useForm({
        resolver: zodResolver(_profileFormSchema),
        defaultValues: {
            firstName: "",
            email: "",
            position: "",
            bio: "",
        },
    });

    useEffect(() => {
        if (dbUser) {
            form.setValue("firstName", dbUser.first_name);
            form.setValue("email", dbUser.email);
        }
    }, [dbUser, form]);

    useEffect(() => {
        const bioValue = form.watch("bio") || "";
        setBioCharactersLeft(160 - bioValue.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch("bio")]);

    const handleSubmit = async (values: { firstName: string; email: string; bio: string }) => {
        setIsUpdatingPersonalInfo(true);

        if (values.email !== dbUser?.email) {
            const { error } = await supabase.auth.updateUser({
                email: values.email,
            });
            setIsUpdatingPersonalInfo(false);

            toast.info("To update the email, please confirm in the email we just sent.");

            if (error) {
                setIsUpdatingPersonalInfo(false);
                toast.error(error.message);
            }
        }

        if (values.firstName !== dbUser?.first_name) {
            const result = await _updateUserName(authUser?.id ?? "", values.firstName);

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
        <ProfileSection
            title="Personal Information"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Timo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="m@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="position"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                    <Input placeholder="Software Engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Input placeholder="Lorem ipsum dolor sit amet." {...field} />
                                </FormControl>
                                <FormDescription>
                                    {bioCharactersLeft} characters remaining
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
                        className="self-start"
                    >
                        {isUpdatingPersonalInfo ? "Updating..." : "Update Profile"}
                    </Button>
                </form>
            </Form>
        </ProfileSection>
    );
};
