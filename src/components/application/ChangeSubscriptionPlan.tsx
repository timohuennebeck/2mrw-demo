import { getCurrency, isFreePlanEnabled, isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { TextConstants } from "@/constants/TextConstants";
import { useSession } from "@/context/SessionContext";
import { useSubscription } from "@/context/SubscriptionContext";
import useClickOutside from "@/hooks/useClickOutside";
import { cancelUserSubscription, startFreePlan } from "@/services/database/subscriptionService";
import {
    getPriceForCurrentProduct,
    getProductDetailsByStripePriceId,
    getStripePriceIdBasedOnSelectedPlanId,
} from "@/services/domain/pricingService";
import {
    cancelStripeSubscription,
    initiateStripeCheckoutProcess,
} from "@/services/stripe/stripeService";
import { ProductWithPrices, PurchasedSubscription } from "@/interfaces";
import { formatDateToDayMonthYear } from "@/utils/date/dateHelper";
import { User } from "@supabase/supabase-js";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { BillingPlan, SubscriptionInterval, SubscriptionStatus } from "@/enums";
import CustomButton from "@/components/application/CustomButton";
import CustomPopup from "@/components/application/CustomPopup";
import FormHeader from "@/components/application/FormHeader";
import { Button } from "../ui/button";

const _findButtonTitle = (isFreePlan: boolean, subscriptionStatus: SubscriptionStatus) => {
    if (!subscriptionStatus) return TextConstants.TEXT__UNLOCK_PLAN;

    if (isFreePlan) return TextConstants.TEXT__DOWNGRADE_TO_FREE_PLAN;

    return TextConstants.TEXT__CHANGE_PLAN;
};

const _isFreePlan = ({
    products,
    selectedPlanId,
    subscriptionStatus,
}: {
    products: ProductWithPrices[];
    selectedPlanId: string;
    subscriptionStatus: SubscriptionStatus;
}) => {
    if (!subscriptionStatus) return false;

    return products.find((p) => p.id === selectedPlanId)?.billing_plan === BillingPlan.NONE;
};

export interface ChangeSubscriptionPlanParams {
    products: ProductWithPrices[];
}

const ChangeSubscriptionPlan = ({ products }: ChangeSubscriptionPlanParams) => {
    const { authUser } = useSession();
    const { subscription } = useSubscription();

    const router = useRouter();
    const formRef = useRef(null);

    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [subscriptionInterval, setSubscriptionInterval] = useState(SubscriptionInterval.MONTHLY);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

    useClickOutside({
        ref: formRef,
        handler: () => setSelectedPlanId(""),
        enabled: !showConfirmationPopup,
    });

    const activeStripePriceId = subscription?.stripe_price_id;
    const subscribedProductDetails = getProductDetailsByStripePriceId(
        products,
        activeStripePriceId ?? null,
    );
    const isFreePlanSelected = _isFreePlan({
        products,
        selectedPlanId,
        subscriptionStatus: subscription?.status ?? SubscriptionStatus.EXPIRED,
    });

    const getProductPriceDetails = (product: ProductWithPrices) => {
        const isFreePlan = product.billing_plan === BillingPlan.NONE;

        const pricing = isFreePlan
            ? null
            : getPriceForCurrentProduct(product.prices, subscriptionInterval);

        // if the subscription is undefined, then there are no entries in the database and the user is not subscribed to any plan
        const isSubscribedToPlan = subscription
            ? isFreePlan
                ? subscribedProductDetails?.id === product.id
                : pricing?.stripe_price_id === activeStripePriceId
            : false;

        return {
            isFreePlan,
            pricing,
            isSubscribedToPlan,
            planIsDisabled: isSubscribedToPlan,
        };
    };

    const handleDowngradeToFreePlan = async (
        authUser: User,
        subscription: PurchasedSubscription,
    ) => {
        if (subscription?.stripe_subscription_id) {
            const { error: stripeCancellationError } = await cancelStripeSubscription(
                subscription.stripe_subscription_id,
            );

            if (stripeCancellationError) {
                console.error("Failed to cancel Stripe subscription!");
                toast.error("Failed to cancel subscription in Stripe!");
                return { success: false, error: stripeCancellationError };
            }
        }

        /**
         * cancels the user subscription in the database = SubscriptionStatus.CANCELLED
         * a cron job will run on the next billing date to downgrade the user to the free plan
         */

        await cancelUserSubscription(authUser?.id ?? "", subscription?.end_date ?? "");

        const subscriptionEndDate = formatDateToDayMonthYear(subscription?.end_date ?? "");
        const toastInfo = `Your subscription has been cancelled and will be downgraded to the free plan on ${subscriptionEndDate}!`;
        toast.success(toastInfo);

        return { success: true, error: null };
    };

    const handleConfirmSubscription = async () => {
        try {
            setIsLoading(true);

            const selectedProduct = products.find((p) => p.id === selectedPlanId);
            const isFreePlanSelected = selectedProduct?.billing_plan === BillingPlan.NONE;

            // if the user isn't subscribed to any plan and wants the free plan, we need to start the free plan
            if (isFreePlanSelected && !subscription?.status) {
                const { error } = await startFreePlan(authUser?.id ?? "");
                if (error) throw error;
                return;
            }

            // handles the downgrade of the free plan as we use this function for both the downgrade and the upgrade
            if (isFreePlanSelected && subscription && authUser) {
                const { error } = await handleDowngradeToFreePlan(authUser, subscription);
                if (error) throw error;
                return;
            }

            const stripePriceId = getStripePriceIdBasedOnSelectedPlanId({
                products,
                selectedPlanId,
                subscriptionInterval,
                billingPlan: selectedProduct?.billing_plan ?? BillingPlan.RECURRING,
            });

            if (!stripePriceId) {
                toast.error("Invalid plan selection");
                return;
            }

            const { checkoutUrl } = await initiateStripeCheckoutProcess({
                stripePriceId,
                successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
                existingSubscriptionId: subscription?.stripe_subscription_id,
            });

            router.push(checkoutUrl ?? "/billing", { scroll: false });
        } catch (error) {
            console.error("Error changing subscription:", error);
            toast.error("Failed to change subscription plan");
        } finally {
            setShowConfirmationPopup(false);
            setIsLoading(false);
        }
    };

    return (
        <>
            {showConfirmationPopup && (
                <CustomPopup
                    dataTestId="change-subscription-popup"
                    title={TextConstants.TEXT__CONFIRM_SUBSCRIPTION_CHANGE}
                    description={`You're about to switch to the ${products.find((p) => p.id === selectedPlanId)?.name} plan. Please confirm to continue.`}
                    icon={<ShieldAlert size={32} strokeWidth={1.5} className="text-yellow-500" />}
                    iconBackgroundColor="bg-yellow-100"
                    mainButtonText={TextConstants.TEXT__CONFIRM}
                    onConfirm={handleConfirmSubscription}
                    mainButtonIsLoading={isLoading}
                    onCancel={() => setShowConfirmationPopup(false)}
                />
            )}

            <div className="mt-8">
                {!isOneTimePaymentEnabled() && (
                    <div className="mb-6 flex space-x-4">
                        {isFreePlanEnabled() && (
                            <Button
                                variant={
                                    subscriptionInterval !== SubscriptionInterval.NONE
                                        ? "outline"
                                        : "default"
                                }
                                size="sm"
                                onClick={() => setSubscriptionInterval(SubscriptionInterval.NONE)}
                                className="rounded-none shadow-none"
                            >
                                {TextConstants.TEXT__FREE.toUpperCase()}
                            </Button>
                        )}

                        <Button
                            variant={
                                subscriptionInterval !== SubscriptionInterval.MONTHLY
                                    ? "outline"
                                    : "default"
                            }
                            size="sm"
                            onClick={() => setSubscriptionInterval(SubscriptionInterval.MONTHLY)}
                            className="rounded-none shadow-none"
                        >
                            {`${TextConstants.TEXT__MONTHLY.toUpperCase()} (PREMIUM)`}
                        </Button>

                        <Button
                            variant={
                                subscriptionInterval !== SubscriptionInterval.YEARLY
                                    ? "outline"
                                    : "default"
                            }
                            size="sm"
                            onClick={() => setSubscriptionInterval(SubscriptionInterval.YEARLY)}
                            className="rounded-none shadow-none"
                        >
                            {`${TextConstants.TEXT__YEARLY.toUpperCase()} (PREMIUM)`}
                        </Button>
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setShowConfirmationPopup(true);
                    }}
                    ref={formRef}
                >
                    <div className="space-y-4">
                        {products
                            .filter((p) => {
                                if (isOneTimePaymentEnabled()) {
                                    const isOneTimePlan = p.billing_plan === BillingPlan.ONE_TIME;
                                    const showFreePlan =
                                        isFreePlanEnabled() && p.billing_plan === BillingPlan.NONE;

                                    return isOneTimePlan || showFreePlan;
                                }

                                return subscriptionInterval === SubscriptionInterval.NONE
                                    ? p.billing_plan === BillingPlan.NONE
                                    : p.billing_plan !== BillingPlan.NONE &&
                                          p.billing_plan !== BillingPlan.ONE_TIME;
                            })
                            .map((product) => {
                                const { isFreePlan, pricing, isSubscribedToPlan, planIsDisabled } =
                                    getProductPriceDetails(product);

                                return (
                                    <div
                                        key={product.id}
                                        data-testid={`subscription-plan-${product.subscription_tier.toLowerCase()}`}
                                        className={`relative border ${
                                            selectedPlanId === product.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 bg-white hover:bg-gray-50"
                                        } ${planIsDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} p-4`}
                                        onClick={() =>
                                            !planIsDisabled && setSelectedPlanId(product.id)
                                        }
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`${product.id}-plan`}
                                                    name="subscription-plan"
                                                    value={product.id}
                                                    checked={selectedPlanId === product.id}
                                                    onChange={() => {}}
                                                    disabled={planIsDisabled}
                                                    className="mr-3 h-4 w-4 text-blue-600 disabled:opacity-50"
                                                />
                                                <label
                                                    htmlFor={`${product.id}-plan`}
                                                    className={`text-sm ${
                                                        planIsDisabled
                                                            ? "cursor-not-allowed"
                                                            : "cursor-pointer"
                                                    }`}
                                                >
                                                    <div className="font-medium text-gray-700">
                                                        {product.name}
                                                        {isSubscribedToPlan && " (Current Plan)"}
                                                    </div>
                                                    <div className="pr-8 text-gray-500">
                                                        {product.description}
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="text-right">
                                                <div className="whitespace-nowrap font-medium text-gray-700">
                                                    {isFreePlan
                                                        ? "Free"
                                                        : pricing
                                                          ? `${getCurrency() === "EUR" ? "€" : "$"} ${pricing.current_amount}`
                                                          : "N/A"}
                                                </div>
                                                <div className="whitespace-nowrap text-sm text-gray-500">
                                                    {isFreePlan
                                                        ? "FOREVER"
                                                        : pricing?.interval ===
                                                            SubscriptionInterval.MONTHLY
                                                          ? "PER MONTH"
                                                          : "PER YEAR"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    <div className="mt-6 flex items-start justify-start">
                        <Button
                            variant="outline"
                            disabled={!selectedPlanId}
                            className="rounded-none shadow-none"
                            size="sm"
                        >
                            {_findButtonTitle(
                                isFreePlanSelected,
                                subscription?.status ?? SubscriptionStatus.EXPIRED,
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChangeSubscriptionPlan;
