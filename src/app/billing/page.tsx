"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import {
    getStripeCustomerCreditCardDetails,
    getStripeCustomerId,
    handleStripePortalSession,
} from "@/lib/stripe/stripeUtils";
import { createClient } from "@/services/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface CreditCardDetails {
    brand: string;
    last4Digits: string;
    expirationMonth: number;
    expirationYear: number;
}

const BillingPage = () => {
    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly");
    const [user, setUser] = useState<User | null>(null);
    const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
    const [creditCardDetails, setCreditCardDetails] = useState<CreditCardDetails | null>(null);

    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();
    }, []);

    useEffect(() => {
        const fetchStripeCustomerCreditCardDetails = async () => {
            if (!user?.email) return;

            const customerId = await getStripeCustomerId(user.email);
            setStripeCustomerId(customerId);
            const creditCardDetails = await getStripeCustomerCreditCardDetails(customerId);
            setCreditCardDetails(creditCardDetails);
        };

        fetchStripeCustomerCreditCardDetails();
    }, [user]);

    const handleSubscriptionChange = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement logic to change subscription plan
        console.log("Subscription plan change submitted", { selectedPlan });
    };

    return (
        <DashboardLayout>
            <div className="container max-w-3xl bg-white">
                <h2 className="mb-2 text-xl font-medium">Billing and Subscription</h2>
                <p className="mb-6 text-sm text-gray-500">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!
                </p>

                <div>
                    <h3 className="mb-4 mt-8 text-lg font-medium">Billing Method</h3>
                    <p className="mb-6 text-sm text-gray-500">
                        Your billing information is securely managed by Stripe. To update your
                        payment details, please click the button below.
                    </p>
                    <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Current Billing Method
                            </p>
                            <p className="text-sm text-gray-500">{`${creditCardDetails?.brand.toUpperCase() ?? "Unknown"} ending in ${creditCardDetails?.last4Digits ?? "Unknown"}`}</p>
                        </div>
                        <button
                            onClick={async () => {
                                const url = await handleStripePortalSession(stripeCustomerId ?? "");
                                window.open(url ?? "", "_blank");
                            }}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Update Billing Method
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 mt-8 text-lg font-medium">Your Current Subscription</h3>
                    <div className="mb-6 rounded-lg border border-gray-200 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <h4 className="text-xl font-medium text-gray-700">Teams Plan</h4>
                                <span className="ml-3 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                    MONTHLY
                                </span>
                            </div>
                            <p className="text-2xl font-medium text-gray-700">$19.99/month</p>
                        </div>
                        <p className="mb-4 text-sm text-gray-500">
                            Your subscription will renew on{" "}
                            <span className="font-medium">December 02, 2023</span>
                        </p>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    // Implement logic to cancel subscription
                                    console.log("Cancelling subscription");
                                }}
                                className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                            >
                                Cancel Subscription
                            </button>
                        </div>
                    </div>

                    <h3 className="mb-4 mt-8 text-lg font-medium">Change Your Plan</h3>
                    <p className="mb-6 text-sm text-gray-500">
                        Choose a plan that best fits your needs. You can upgrade or downgrade at any
                        time.
                    </p>
                    <div className="mb-6 flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setSelectedBillingCycle("monthly")}
                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                                selectedBillingCycle === "monthly"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            MONTHLY
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedBillingCycle("yearly")}
                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                                selectedBillingCycle === "yearly"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            YEARLY (SAVE 20%)
                        </button>
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
                                        plan.name !== "Teams" &&
                                        setSelectedPlan(plan.name.toLowerCase())
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
                                                <div className="font-medium text-gray-700">
                                                    {plan.name}
                                                </div>
                                                <div className="text-gray-500">
                                                    {plan.description}
                                                </div>
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
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Change Plan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BillingPage;
