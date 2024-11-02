import { TextConstants } from "@/constants/TextConstants";
import CustomButton from "../CustomButton";
import HeaderWithDescription from "../HeaderWithDescription";
import { paymentConfig } from "@/config/paymentConfig";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useProducts } from "@/context/ProductsContext";
import useFreeTrial from "@/hooks/useFreeTrial";
import useSubscription from "@/hooks/useSubscription";
import { Product } from "@/interfaces/ProductInterfaces";
import {
    getProductDetailsByStripePriceId,
    getStripePriceIdBasedOnSelectedPlan,
} from "@/lib/helper/priceHelper";
import { initiateStripeCheckoutProcess } from "@/lib/stripe/stripeUtils";

const ChangeSubscriptionPlan = () => {
    const { products } = useProducts();
    const { user } = useSession();

    const { subscription } = useSubscription(user?.id ?? "");
    const { freeTrial } = useFreeTrial(user?.id ?? "");

    const formRef = useRef<HTMLFormElement>(null);

    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setSelectedPlan("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!products) return null;

    const activeStripePriceId = subscription?.stripe_price_id || freeTrial?.stripe_price_id;
    const activeProductDetails = activeStripePriceId
        ? getProductDetailsByStripePriceId(products, activeStripePriceId)
        : null;
    const isOneTimePaymentPlan = activeProductDetails?.price?.interval === "one-time";

    const filteredProducts = products?.filter((product: Product) => {
        if (isOneTimePaymentPlan) {
            return product.pricing.one_time; // if user is on OTP, only show OTP plans
        }

        return product.pricing.subscription; // if user is on subscription, only show subscription plans
    });

    const handleSubscriptionChange = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!user?.email || !selectedPlan) {
                toast.error("Please select a plan to continue");
                return;
            }

            const stripePriceId = getStripePriceIdBasedOnSelectedPlan({
                products,
                selectedPlan,
                selectedBillingCycle,
                isOneTimePaymentPlan,
            });

            if (!stripePriceId) {
                toast.error("Invalid plan selection");
                return;
            }

            const { checkoutUrl } = await initiateStripeCheckoutProcess({
                userId: user.id,
                userEmail: user.email,
                stripePriceId,
            });

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error("Error changing subscription:", error);
            toast.error("Failed to change subscription plan");
        }
    };

    return (
        <div>
            <HeaderWithDescription
                title="Change Your Plan"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam et odit autem alias aut praesentium vel nisi repudiandae saepe consectetur!"
            />

            {!isOneTimePaymentPlan && (
                <div className="mb-6 flex space-x-4">
                    <CustomButton
                        title={TextConstants.TEXT__MONTHLY.toUpperCase()}
                        onClick={() => setSelectedBillingCycle("monthly")}
                        isSecondary={selectedBillingCycle !== "monthly"}
                    />
                    <CustomButton
                        title={`${TextConstants.TEXT__YEARLY.toUpperCase()} (${paymentConfig.subscriptionSettings.yearlyDiscountPercentage}%)`}
                        onClick={() => setSelectedBillingCycle("yearly")}
                        isSecondary={selectedBillingCycle !== "yearly"}
                    />
                </div>
            )}

            <form onSubmit={handleSubscriptionChange} ref={formRef}>
                <div className="space-y-4">
                    {filteredProducts?.map((product) => {
                        const price = isOneTimePaymentPlan
                            ? product.pricing.one_time
                            : selectedBillingCycle === "monthly"
                              ? product.pricing.subscription?.monthly
                              : product.pricing.subscription?.yearly;

                        // check if this is the current active plan
                        const isCurrentPlan = activeProductDetails?.id === product.id;

                        return (
                            <div
                                key={product.id}
                                className={`relative rounded-lg border ${
                                    selectedPlan === product.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 bg-white"
                                } ${isCurrentPlan ? "cursor-not-allowed opacity-50" : "cursor-pointer"} p-4`}
                                onClick={() => !isCurrentPlan && setSelectedPlan(product.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`${product.id}-plan`}
                                            name="subscription-plan"
                                            value={product.id}
                                            checked={selectedPlan === product.id}
                                            onChange={() => {}}
                                            disabled={isCurrentPlan}
                                            className="mr-3 h-4 w-4 text-blue-600 disabled:opacity-50"
                                        />
                                        <label
                                            htmlFor={`${product.id}-plan`}
                                            className={`text-sm ${
                                                isCurrentPlan
                                                    ? "cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            <div className="font-medium text-gray-700">
                                                {product.name}
                                                {isCurrentPlan && " (Current Plan)"}
                                            </div>
                                            <div className="text-gray-500">
                                                {product.description}
                                            </div>
                                        </label>
                                    </div>
                                    <div className="text-right">
                                        <div className="whitespace-nowrap font-medium text-gray-700">
                                            {price ? `${price.current} ${price.currency}` : "N/A"}
                                        </div>
                                        <div className="whitespace-nowrap text-sm text-gray-500">
                                            {isOneTimePaymentPlan
                                                ? "ONE-TIME PAYMENT"
                                                : selectedBillingCycle === "monthly"
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
                    <CustomButton title="Change Plan" disabled={!selectedPlan} isLoading={false} />
                </div>
            </form>
        </div>
    );
};

export default ChangeSubscriptionPlan;
