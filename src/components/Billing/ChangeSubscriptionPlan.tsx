import { TextConstants } from "@/constants/TextConstants";
import CustomButton from "../CustomButton";

import HeaderWithDescription from "../HeaderWithDescription";
import { paymentConfig } from "@/config/paymentConfig";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useProducts } from "@/context/ProductsContext";
import useFreeTrial from "@/hooks/useFreeTrial";
import useSubscription from "@/hooks/useSubscription";

const ChangeSubscriptionPlan = () => {
    const { products } = useProducts();
    const { user } = useSession();

    const { subscription } = useSubscription(user?.id ?? "");
    const { freeTrial } = useFreeTrial(user?.id ?? "");

    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly");

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
            <form onSubmit={handleSubscriptionChange}>
                <div className="space-y-4">
                    {[
                        {
                            name: "Individual",
                            description: "Perfect for individuals and small projects.",
                            monthlyPrice: "$9.99",
                            yearlyPrice: "$95.90",
                        },
                        {
                            name: "Teams",
                            description: "Ideal for growing businesses and teams.",
                            monthlyPrice: "$19.99",
                            yearlyPrice: "$191.90",
                        },
                    ].map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-lg border ${
                                selectedPlan === plan.name.toLowerCase()
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 bg-white"
                            } p-4 ${plan.name === "Teams" ? "opacity-50" : "cursor-pointer"}`}
                            onClick={() =>
                                plan.name !== "Teams" && setSelectedPlan(plan.name.toLowerCase())
                            }
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`${plan.name.toLowerCase()}-plan`}
                                        name="subscription-plan"
                                        value={plan.name.toLowerCase()}
                                        checked={selectedPlan === plan.name.toLowerCase()}
                                        onChange={() => {}}
                                        className="mr-3 h-4 w-4 text-blue-600"
                                        disabled={plan.name === "Teams"}
                                    />
                                    <label
                                        htmlFor={`${plan.name.toLowerCase()}-plan`}
                                        className={`cursor-pointer text-sm ${
                                            plan.name === "Teams"
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }`}
                                    >
                                        <div className="font-medium text-gray-700">{plan.name}</div>
                                        <div className="text-gray-500">{plan.description}</div>
                                    </label>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-gray-700">
                                        {selectedBillingCycle === "monthly"
                                            ? plan.monthlyPrice
                                            : plan.yearlyPrice}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {selectedBillingCycle === "monthly"
                                            ? "per month"
                                            : "per year"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-start justify-start">
                    <CustomButton title="Change Plan" disabled={!selectedPlan} isLoading={false} />
                </div>
            </form>
        </div>
    );
};

export default ChangeSubscriptionPlan;
