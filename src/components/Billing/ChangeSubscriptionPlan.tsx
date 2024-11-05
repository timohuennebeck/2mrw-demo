import { TextConstants } from "@/constants/TextConstants";
import CustomButton from "../CustomButton";
import HeaderWithDescription from "../HeaderWithDescription";
import { getCurrency, paymentConfig } from "@/config/paymentConfig";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useProducts } from "@/context/ProductsContext";
import useFreeTrial from "@/hooks/useFreeTrial";
import useSubscription from "@/hooks/useSubscription";
import { initiateStripeCheckoutProcess } from "@/lib/stripe/stripeUtils";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import CustomPopup from "../CustomPopup";
import { ShieldAlert } from "lucide-react";
import { SubscriptionInterval } from "@/interfaces/StripePrices";
import { PricingService } from "@/services/PricingService";
import { PricingModel } from "@/interfaces/StripePrices";
import useClickOutside from "@/hooks/useClickOutside";
import { useRouter } from "next/navigation";

const ChangeSubscriptionPlan = () => {
    const { authUser } = useSession();
    const { products } = useProducts();
    const { subscription } = useSubscription(authUser?.id ?? "");
    const { freeTrial } = useFreeTrial(authUser?.id ?? "");

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

    const userIsOnFreeTrial = freeTrial?.status === FreeTrialStatus.ACTIVE;

    const activeStripePriceId = subscription?.stripe_price_id ?? freeTrial?.stripe_price_id;
    const activeProductDetails = activeStripePriceId
        ? PricingService.getProductDetailsByStripePriceId(products, activeStripePriceId)
        : null;

    const isOneTimePaymentPlan = activeProductDetails?.price?.interval === PricingModel.ONE_TIME;

    const handleSubscriptionChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authUser?.email || !selectedPlanId) {
            toast.error("Please select a plan to continue");
            return;
        }

        setShowConfirmationPopup(true);
    };

    const handleConfirmSubscription = async () => {
        try {
            setIsLoading(true);
            setShowConfirmationPopup(false);

            const stripePriceId = PricingService.getStripePriceIdBasedOnSelectedPlan({
                products,
                selectedPlan: selectedPlanId,
                selectedBillingCycle: subscriptionInterval,
                isOneTimePaymentPlan,
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
                    description={`Change current subscription plan from ${activeProductDetails?.name} to ${products.find((p) => p.id === selectedPlanId)?.name}?`}
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

                {!isOneTimePaymentPlan && (
                    <div className="mb-6 flex space-x-4">
                        <CustomButton
                            title={TextConstants.TEXT__MONTHLY.toUpperCase()}
                            onClick={() => setSubscriptionInterval(SubscriptionInterval.MONTHLY)}
                            isSecondary={subscriptionInterval !== SubscriptionInterval.MONTHLY}
                        />
                        <CustomButton
                            title={`${TextConstants.TEXT__YEARLY.toUpperCase()} (${paymentConfig.subscriptionSettings.yearlyDiscountPercentage}%)`}
                            onClick={() => setSubscriptionInterval(SubscriptionInterval.YEARLY)}
                            isSecondary={subscriptionInterval !== SubscriptionInterval.YEARLY}
                        />
                    </div>
                )}

                <form onSubmit={handleSubscriptionChange} ref={formRef}>
                    <div className="space-y-4">
                        {products?.map((product) => {
                            const isFreeProduct = product.pricing_model === PricingModel.FREE;
                            const price = !isFreeProduct
                                ? PricingService.getPrice({
                                      product,
                                      pricingModel: isOneTimePaymentPlan
                                          ? PricingModel.ONE_TIME
                                          : PricingModel.SUBSCRIPTION,
                                      interval:
                                          subscriptionInterval === SubscriptionInterval.MONTHLY
                                              ? SubscriptionInterval.MONTHLY
                                              : SubscriptionInterval.YEARLY,
                                  })
                                : null;

                            const isSubscribedToPlan = isFreeProduct
                                ? activeProductDetails?.id === product.id
                                : PricingService.isSubscribedToPlan(
                                      price?.stripe_price_id ?? "",
                                      activeStripePriceId,
                                  );

                            const isDisabled = isSubscribedToPlan && !userIsOnFreeTrial;

                            return (
                                <div
                                    key={product.id}
                                    className={`relative rounded-lg border ${
                                        selectedPlanId === product.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 bg-white"
                                    } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} p-4`}
                                    onClick={() => !isDisabled && setSelectedPlanId(product.id)}
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
                                                disabled={isDisabled}
                                                className="mr-3 h-4 w-4 text-blue-600 disabled:opacity-50"
                                            />
                                            <label
                                                htmlFor={`${product.id}-plan`}
                                                className={`text-sm ${
                                                    isDisabled
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
                                                {isFreeProduct
                                                    ? "Free"
                                                    : price
                                                      ? `${price.current_amount} ${getCurrency()}`
                                                      : "N/A"}
                                            </div>
                                            <div className="whitespace-nowrap text-sm text-gray-500">
                                                {isFreeProduct
                                                    ? "FOREVER"
                                                    : price?.subscription_interval ===
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
                            title={
                                !subscription
                                    ? TextConstants.TEXT__UNLOCK_PLAN
                                    : userIsOnFreeTrial
                                      ? TextConstants.TEXT__UPGRADE_PLAN
                                      : TextConstants.TEXT__CHANGE_PLAN
                            }
                            disabled={!selectedPlanId || isLoading}
                            isLoading={isLoading}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChangeSubscriptionPlan;
