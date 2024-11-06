import { TextConstants } from "@/constants/TextConstants";
import CustomButton from "../CustomButton";
import HeaderWithDescription from "../HeaderWithDescription";
import { getCurrency, isFreePlanEnabled, isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useProducts } from "@/context/ProductsContext";
import useSubscription from "@/hooks/useSubscription";
import { cancelStripeSubscription, initiateStripeCheckoutProcess } from "@/lib/stripe/stripeUtils";
import CustomPopup from "../CustomPopup";
import { ShieldAlert } from "lucide-react";
import { SubscriptionInterval } from "@/interfaces/StripePrices";
import {
    getPriceForCurrentProduct,
    getProductDetailsByStripePriceId,
    getStripePriceIdBasedOnSelectedPlanId,
} from "@/services/domain/PricingService";
import { BillingPlan } from "@/interfaces/StripePrices";
import useClickOutside from "@/hooks/useClickOutside";
import { useRouter } from "next/navigation";
import { cancelUserSubscription, startFreePlan } from "@/services/database/SubscriptionService";
import { ProductWithPrices } from "@/interfaces/ProductInterfaces";
import { formatDateToDayMonthYear } from "@/lib/helper/DateHelper";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { User } from "@supabase/supabase-js";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";

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

const _handleDowngradeToFreePlan = async (authUser: User, subscription: PurchasedSubscription) => {
    const router = useRouter();

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

    router.refresh();
    return { success: true, error: null };
};

const ChangeSubscriptionPlan = () => {
    const { authUser } = useSession();
    const { products } = useProducts();
    const { subscription } = useSubscription(authUser?.id ?? "");

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

    if (!products) return null;

    const activeStripePriceId = subscription?.stripe_price_id;
    const subscribedProductDetails = getProductDetailsByStripePriceId(
        products,
        activeStripePriceId,
    );
    const isFreePlanSelected = _isFreePlan({
        products,
        selectedPlanId,
        subscriptionStatus: subscription?.status,
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

    const handleConfirmSubscription = async () => {
        try {
            setIsLoading(true);
            setShowConfirmationPopup(false);

            const selectedProduct = products.find((p) => p.id === selectedPlanId);
            const isFreePlanSelected = selectedProduct?.billing_plan === BillingPlan.NONE;

            // if the user isn't subscribed to any plan and wants the free plan, we need to start the free plan
            if (isFreePlanSelected && !subscription?.status) {
                const { error } = await startFreePlan(authUser?.id ?? "");
                if (error) throw error;

                router.replace("/billing?success=true");
                return;
            }

            // handles the downgrade of the free plan as we use this function for both the downgrade and the upgrade
            if (isFreePlanSelected && authUser) {
                const { error } = await _handleDowngradeToFreePlan(authUser, subscription);
                if (error) throw error;
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
                userEmail: authUser?.email ?? "",
                stripePriceId,
                successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
                existingSubscriptionId: subscription?.stripe_subscription_id,
            });

            router.replace(checkoutUrl ?? "/billing");
        } catch (error) {
            console.error("Error changing subscription:", error);
            toast.error("Failed to change subscription plan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {showConfirmationPopup && (
                <CustomPopup
                    title="Confirm Subscription Change"
                    description={`You're about to switch to the ${products.find((p) => p.id === selectedPlanId)?.name} plan. Please confirm to continue.`}
                    icon={<ShieldAlert size={32} strokeWidth={1.5} className="text-yellow-500" />}
                    iconBackgroundColor="bg-yellow-100"
                    mainButtonText="Confirm"
                    onConfirm={handleConfirmSubscription}
                    onCancel={() => setShowConfirmationPopup(false)}
                />
            )}

            <div>
                <HeaderWithDescription
                    title="Change Your Plan"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam et odit autem alias aut praesentium vel nisi repudiandae saepe consectetur!"
                />

                {!isOneTimePaymentEnabled() && (
                    <div className="mb-6 flex space-x-4">
                        {isFreePlanEnabled() && (
                            <CustomButton
                                title={TextConstants.TEXT__FREE.toUpperCase()}
                                onClick={() => setSubscriptionInterval(SubscriptionInterval.NONE)}
                                isSecondary={subscriptionInterval !== SubscriptionInterval.NONE}
                            />
                        )}
                        <CustomButton
                            title={`${TextConstants.TEXT__MONTHLY.toUpperCase()} (PREMIUM)`}
                            onClick={() => setSubscriptionInterval(SubscriptionInterval.MONTHLY)}
                            isSecondary={subscriptionInterval !== SubscriptionInterval.MONTHLY}
                        />
                        <CustomButton
                            title={`${TextConstants.TEXT__YEARLY.toUpperCase()} (PREMIUM)`}
                            onClick={() => setSubscriptionInterval(SubscriptionInterval.YEARLY)}
                            isSecondary={subscriptionInterval !== SubscriptionInterval.YEARLY}
                        />
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
                                        className={`relative rounded-lg border ${
                                            selectedPlanId === product.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 bg-white"
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
                        <CustomButton
                            title={_findButtonTitle(isFreePlanSelected, subscription?.status)}
                            disabled={!selectedPlanId || isLoading}
                            isLoading={isLoading}
                            className={`${
                                isFreePlanSelected ? "bg-red-600 text-white hover:bg-red-500" : ""
                            }`}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChangeSubscriptionPlan;
