"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileSection } from "./ProfileSection";
import { z } from "zod";

const passwordFormSchema = z.object({
    currentPassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

export const PasswordSection = () => {
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    const handleSubmit = async () => {
        setIsUpdatingPassword(true);
    };

    return (
        <ProfileSection
            title="Password"
            description="Update your password to keep your account secure."
        >
            <Form {...form}>
                <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        disabled={isUpdatingPassword}
                        className="self-start"
                    >
                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </Form>
        </ProfileSection>
    );
};
