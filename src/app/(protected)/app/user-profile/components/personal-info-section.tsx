"use client";

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
import { useSession } from "@/context/session-context";
import { useUser } from "@/context/user-context";
import { createClient } from "@/services/supabase-clients/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const _profileFormSchema = z.object({
    email: z.string().email(),
    position: z.string().max(50).nullable().optional(),
    bio: z.string().max(160).nullable().optional(),
});

interface UserProfileUpdate {
    email?: string;
    position?: string;
    bio?: string;
}

const LOADING_DELAY = 500;

const _updateUserProfile = async (userId: string, updates: UserProfileUpdate) => {
    const supabase = createClient();

    const { error } = await supabase.from("users").update(updates).eq("id", userId);

    return { error };
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
            email: "",
            position: "",
            bio: "",
        },
    });

    useEffect(() => {
        if (dbUser) {
            form.setValue("email", dbUser.email ?? "");
            form.setValue("position", dbUser.position ?? "");
            form.setValue("bio", dbUser.bio ?? "");
        }
    }, [dbUser, form]);

    useEffect(() => {
        const bioValue = form.watch("bio") || "";
        setBioCharactersLeft(160 - bioValue.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch("bio")]);

    const handleSubmit = async (values: UserProfileUpdate) => {
        setIsUpdatingPersonalInfo(true);

        try {
            const updates: UserProfileUpdate = {};

            // only include changed fields in the update
            if (values.position !== dbUser?.position) updates.position = values.position;
            if (values.bio !== dbUser?.bio) updates.bio = values.bio;

            // handle email separately as it requires auth update
            if (values.email !== dbUser?.email) {
                const { error } = await supabase.auth.updateUser({
                    email: values.email,
                });

                if (error) throw new Error(error.message);
                toast.info("To update the email, please confirm in the email we just sent.");
            }

            // only make the database call if there are changes to update
            if (Object.keys(updates).length !== 0) {
                const { error } = await _updateUserProfile(authUser?.id ?? "", updates);
                if (error) throw new Error(error.message);

                // brief delay to make the loading state feel more responsive
                setTimeout(() => {
                    toast.success("Profile has been updated!");
                }, LOADING_DELAY);
            }
        } catch (error) {
            toast.error("Failed to update user profile");
        } finally {
            setTimeout(() => {
                setIsUpdatingPersonalInfo(false);
            }, LOADING_DELAY);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
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
                                <Input
                                    placeholder="Tell us a little about yourself..."
                                    {...field}
                                />
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
                    isLoading={isUpdatingPersonalInfo}
                    className="self-start"
                >
                    Update Profile
                </Button>
            </form>
        </Form>
    );
};
