"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TextConstants } from "@/constants/TextConstants";
import { useReferral } from "@/context/referral-context";
import { createPendingReferral, getExistingReferral } from "@/services/database/referral-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, Check, Copy, Loader, Send } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { useUser } from "@/context/user-context";
import { EmailType } from "@/enums";
import { appConfig } from "@/config";

interface ReferralCardProps {
    referralLink: string;
    userId: string;
}

const emailFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export const ReferralCard = ({ referralLink, userId }: ReferralCardProps) => {
    const { invalidateReferrals } = useReferral();
    const { dbUser } = useUser();

    const [showCheck, setShowCheck] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(emailFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 2000);
    };

    const onSubmit = async (values: { email: string }) => {
        setIsSubmitting(true);
        try {
            const { data: existingReferral } = await getExistingReferral(values.email);
            if (existingReferral) {
                form.setError("email", {
                    message: `It's not possible to refer the same user multiple times. This user was referred on ${moment(existingReferral.created_at).format("MM-DD-YYYY")} at ${moment(existingReferral.created_at).format("HH:mm")}`,
                });
                return;
            }

            const result = await createPendingReferral(values.email, userId);
            if (!result.success) {
                toast.error(result.error?.message ?? "Failed to send email");
                return;
            }

            invalidateReferrals();

            const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`;
            await axios.post(postUrl, {
                to: values.email,
                subject: `You've been invited to join ${appConfig.company.name}!`,
                emailType: EmailType.REFERRAL_INVITE,
                variables: {
                    nameOfReferrer: dbUser?.email,
                    referralCode: dbUser?.referral_code,
                },
            });

            form.reset();
        } catch (error) {
            form.setError("email", {
                message: "Failed to send email. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative rounded-lg border border-dashed p-4">
            <div className="flex items-start gap-4">
                <div className="rounded-full bg-muted p-2">
                    <Asterisk className="h-5 w-5" />
                </div>
                <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h4 className="text-sm font-medium leading-none">
                            {appConfig.company.name}'s Referral Program
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Share this referral link with friends and earn{" "}
                            <span className="font-semibold text-blue-600">
                                [INSERT_REWARD_FOR_REFERRAL]
                            </span>{" "}
                            for each friend who joins
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                disabled
                                value={referralLink}
                                className="text-sm text-muted-foreground"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopyLink}
                                className="shrink-0"
                            >
                                {showCheck ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">or invite via email:</p>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="friend@example.com"
                                                        className="text-sm"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="submit"
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={isSubmitting}
                                                        className="shrink-0"
                                                    >
                                                        {isSubmitting ? (
                                                            <Loader className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Send className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
