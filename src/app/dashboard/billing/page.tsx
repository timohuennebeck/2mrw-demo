"use client";

import { useSession } from "@/context/SessionContext";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { Check } from "lucide-react";
import { Suspense, useState } from "react";
import useSuccessParam from "@/hooks/useSuccessParam";
import { useProducts } from "@/context/ProductsContext";
import { TextConstants } from "@/constants/TextConstants";
import { useSubscription } from "@/context/SubscriptionContext";
import CustomPopup from "@/components/application/CustomPopup";
import { BillingPlan, SubscriptionStatus } from "@/enums";
import BillingPortal from "@/components/application/BillingPortal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import SimplifiedPricingCard from "@/components/application/SimplifiedPricingCard";

const SuccessHandler = ({ onSuccess }: { onSuccess: () => void }) => {
    useSuccessParam({
        onSuccess,
        redirectPath: "/billing",
    });
    return null;
};

interface BillingSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const BillingSection = ({ title, description, children }: BillingSectionProps) => {
    return (
        <div className="flex flex-col gap-20 md:flex-row">
            <div className="md:w-2/5">
                <h2 className="text-sm font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="md:w-3/5">{children}</div>
        </div>
    );
};

const BillingPage = () => {
    const { authUser } = useSession();
    const { products } = useProducts();
    const { subscription, invalidateSubscription } = useSubscription();

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useSupabaseRealtime({
        table: "user_subscriptions",
        filter: `user_id=eq.${authUser?.id}`,
        onChange: invalidateSubscription,
    });

    /**
     * the ChangeSubscriptionPlan component is only shown if the user has not yet purchased a plan (one-time or recurring)
     * and if he has not cancelled his recurring subscription
     * otherwise, it's hidden because once a user has purchased a OTP plan, he cannot change the plan
     */

    const hasOneTimePaymentPlan = subscription?.billing_plan === BillingPlan.ONE_TIME;
    const hasCancelledSubscription = subscription?.status === SubscriptionStatus.CANCELLED;

    const showChangeSubscriptionPlan = !hasOneTimePaymentPlan && !hasCancelledSubscription;

    return (
        <>
            <Suspense fallback={null}>
                <SuccessHandler onSuccess={() => setShowSuccessPopup(true)} />
            </Suspense>

            {showSuccessPopup && (
                <CustomPopup
                    dataTestId="subscription-success-popup"
                    title={TextConstants.TEXT__SUBSCRIPTION_CONFIRMED}
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    icon={<Check size={32} strokeWidth={1.5} className="text-green-500" />}
                    iconBackgroundColor="bg-green-100"
                    mainButtonText={TextConstants.TEXT__CONTINUE}
                    onConfirm={() => setShowSuccessPopup(false)}
                    hideSecondaryButton
                    showConfetti
                    onCancel={() => setShowSuccessPopup(false)}
                />
            )}

            <div className="flex max-w-5xl flex-col gap-12 bg-white">
                {subscription?.billing_plan === BillingPlan.RECURRING && (
                    <BillingSection
                        title="Billing Portal"
                        description="Manage your subscription and billing information."
                    >
                        <BillingPortal />
                    </BillingSection>
                )}

                <BillingSection
                    title="Contact Email"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, iste!"
                >
                    <div className="space-y-4">
                        <RadioGroup defaultValue="account">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="account" id="account" />
                                <Label htmlFor="account">
                                    Lorem ipsum dolor sit amet.
                                    <p className="text-sm text-muted-foreground">m@example.com</p>
                                </Label>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="alternative" id="alternative" />
                                    <Label htmlFor="alternative">Lorem ipsum dolor sit amet.</Label>
                                </div>
                                <div className="ml-6 mr-20">
                                    <Input type="email" placeholder="billing@untitledui.com" />
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                </BillingSection>

                <Separator />

                <BillingSection
                    title="Invoices"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, iste!"
                >
                    <div className="mr-20 rounded-lg border border-muted p-6">
                        <p className="text-sm text-muted-foreground">
                            To request an invoice, please reach out to our support team at{" "}
                            <a
                                href="mailto:support@example.com"
                                className="text-primary hover:underline"
                            >
                                support@example.com
                            </a>
                        </p>
                    </div>
                </BillingSection>

                <Separator />

                <BillingSection
                    title="Subscription Plans"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, iste!"
                >
                    <div className="mr-20">
                        <SimplifiedPricingCard />
                    </div>
                </BillingSection>
            </div>
        </>
    );
};

export default BillingPage;
