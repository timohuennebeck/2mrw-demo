"use client";

import { Card } from "@/components/ui/card";
import { EmailType } from "@/enums";
import { emailConfig } from "@/config";
import { sendLoopsTransactionalEmail } from "@/services/loops/loopsService";
import { Mail, AlertCircle, MailWarning } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
    emailType: z.nativeEnum(EmailType),
    email: z.string().email("Please enter a valid email address"),
});

export const EmailTester = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [pendingValues, setPendingValues] = useState<z.infer<typeof formSchema> | null>(null);
    const remainingEmails = 2; // This should come from your backend/config

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setPendingValues(values);
        setShowDialog(true);
    };

    const handleConfirmedSubmit = async () => {
        if (!pendingValues) return;

        setIsLoading(true);
        try {
            const dummyVariables: any = {
                purchasedPackage: "Premium Package",
                endDate: "2024-12-31",
                freeTrialEndDate: "2024-04-30",
                name: "Test User",
                upgradeUrl: "https://example.com/upgrade",
            };

            await sendLoopsTransactionalEmail({
                type: pendingValues.emailType,
                email: pendingValues.email,
                variables: dummyVariables,
            });

            toast.success("Email sent successfully!");
            form.reset();
        } catch (error) {
            toast.error("Failed to send email");
        } finally {
            setIsLoading(false);
            setShowDialog(false);
            setPendingValues(null);
        }
    };

    return (
        <>
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            Sample Data Notice
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This email testing tool uses sample data. URLs, dates, and other dynamic
                            content in the emails will be placeholder values. The emails will be
                            delivered, but with test content.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setShowDialog(false);
                                setPendingValues(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmedSubmit}>
                            Send Email
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card className="w-full border-gray-200 p-6 shadow-none hover:shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        <h3 className="font-medium">Email Template Tester</h3>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-md bg-orange-50 px-4 py-2 text-sm text-orange-600">
                        <MailWarning className="h-4 w-4" />
                        <span>You have {remainingEmails} emails remaining</span>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="emailType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Template</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a template" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(emailConfig.templates)
                                                .filter(([_, template]) => template.enabled)
                                                .map(([type]) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.replace(/_/g, " ")}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="test@example.com"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || remainingEmails === 0}
                            isLoading={isLoading}
                        >
                            Send Test Email
                        </Button>
                    </form>
                </Form>
            </Card>
        </>
    );
};
