import { TextConstants } from "@/constants/TextConstants";
import CustomButton from "../CustomButton";
import HeaderWithDescription from "../HeaderWithDescription";
import { isOneTimePaymentEnabled, paymentConfig } from "@/config/paymentConfig";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useProducts } from "@/context/ProductsContext";
import useFreeTrial from "@/hooks/useFreeTrial";
import useSubscription from "@/hooks/useSubscription";
import { Product } from "@/interfaces/ProductInterfaces";

const ChangeSubscriptionPlan = () => {
    const { products } = useProducts();
    const { user } = useSession();

    const { subscription } = useSubscription(user?.id ?? "");
    const { freeTrial } = useFreeTrial(user?.id ?? "");

    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly");

    const filteredProducts = products?.filter((product: Product) => {
        // If user is on OTP, only show OTP plans
        if (isOneTimePaymentEnabled()) {
            return product.pricing.one_time;
        }
        // If user is on subscription, only show subscription plans
        return product.pricing.subscription;
    });

    const handleSubscriptionChange = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!user?.email || !selectedPlan) {
                toast.error("Please select a plan to continue");
                return;
            }

            // const { checkoutUrl } = await initiateStripeCheckoutProcess({
            //     userId: user.id,
            //     userEmail: user.email,
            //     stripePriceId: getStripePriceId(selectedPlan, selectedBillingCycle),
            // });

            // if (checkoutUrl) {
            //     window.location.href = checkoutUrl;
            // }
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

            {/* Only show billing cycle toggle for subscription plans */}
            {!isOneTimePaymentEnabled() && (
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

            <form onSubmit={handleSubscriptionChange}>
                <div className="space-y-4">
                    {filteredProducts?.map((product) => {
                        const price = isOneTimePaymentEnabled()
                            ? product.pricing.one_time
                            : selectedBillingCycle === "monthly"
                              ? product.pricing.subscription?.monthly
                              : product.pricing.subscription?.yearly;

                        // Check if this is the current active plan
                        const isCurrentPlan =
                            subscription?.stripe_price_id === product.id.toString();

                        return (
                            <div
                                key={product.id}
                                className={`relative rounded-lg border ${
                                    selectedPlan === product.id.toString()
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 bg-white"
                                } ${isCurrentPlan ? "opacity-50" : ""} cursor-pointer p-4`}
                                onClick={() =>
                                    !isCurrentPlan && setSelectedPlan(product.id.toString())
                                }
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`${product.id}-plan`}
                                            name="subscription-plan"
                                            value={product.id.toString()}
                                            checked={selectedPlan === product.id.toString()}
                                            onChange={() => {}}
                                            disabled={isCurrentPlan}
                                            className="mr-3 h-4 w-4 text-blue-600 disabled:opacity-50"
                                        />
                                        <label
                                            htmlFor={`${product.id}-plan`}
                                            className={`cursor-pointer text-sm ${
                                                isCurrentPlan ? "cursor-not-allowed" : ""
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
                                            {isOneTimePaymentEnabled()
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
