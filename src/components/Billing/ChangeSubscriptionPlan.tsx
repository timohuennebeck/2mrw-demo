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
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import SubscriptionSuccessPopup from "../SubscriptionSuccessPopup";
import { useSearchParams } from "next/dist/client/components/navigation";
import { useRouter } from "next/navigation";
import ChangeSubscriptionConfirmationPopup from "../ChangeSubscriptionConfirmationPopup";

const _isExactPlanMatch = ({
    activeStripePriceId,
    isOneTimePaymentPlan,
    selectedBillingCycle,
    product,
}: {
    activeStripePriceId: string;
    isOneTimePaymentPlan: boolean;
    selectedBillingCycle: string;
    product: Product;
}) => {
    if (!activeStripePriceId) return false;

    const currentPlanPriceId = isOneTimePaymentPlan
        ? product.pricing.one_time?.stripe_price_id
        : selectedBillingCycle === "monthly"
          ? product.pricing.subscription?.monthly?.stripe_price_id
          : product.pricing.subscription?.yearly?.stripe_price_id;

    return (
        _isProductSubscribed({ activeStripePriceId, product }) &&
        activeStripePriceId === currentPlanPriceId
    );
};

const _isProductSubscribed = ({
    activeStripePriceId,
    product,
}: {
    activeStripePriceId: string;
    product: Product;
}) => {
    if (!activeStripePriceId) return false;

    // get all possible price IDs for this product
    const productPriceIds = [
        product.pricing.subscription?.monthly?.stripe_price_id,
        product.pricing.subscription?.yearly?.stripe_price_id,
        product.pricing.one_time?.stripe_price_id,
    ].filter(Boolean);

    // check if the active price ID matches any of the product's price IDs
    return productPriceIds.includes(activeStripePriceId);
};

const ChangeSubscriptionPlan = () => {
    const { products } = useProducts();
    const { authUser } = useSession();

    const { subscription } = useSubscription(authUser?.id ?? "");
    const { freeTrial } = useFreeTrial(authUser?.id ?? "");

    const router = useRouter();
    const searchParams = useSearchParams();

    const formRef = useRef<HTMLFormElement>(null);

    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!showConfirmationPopup && formRef.current && !formRef.current.contains(event.target as Node)) {
                setSelectedPlan("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmationPopup]);

    useEffect(() => {
        const success = searchParams.get("success");
        if (success === "true") {
            setShowSuccessPopup(true);
            router.replace("/billing"); // clean up the URL without the success parameter
        }
    }, [searchParams, router]);

    if (!products) return null;

    const isOnFreeTrial = freeTrial?.status === FreeTrialStatus.ACTIVE;
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

        if (!authUser?.email || !selectedPlan) {
            toast.error("Please select a plan to continue");
            return;
        }

        // find selected product details
        const selectedProduct = products.find((p) => p.id === selectedPlan);
        setSelectedProductDetails(selectedProduct || null);
        setShowConfirmationPopup(true);
    };

    const handleConfirmSubscription = async () => {
        try {
            setIsLoading(true);
            setShowConfirmationPopup(false);

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
                userEmail: authUser?.email ?? "",
                stripePriceId,
                successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
                existingSubscriptionId: subscription?.stripe_subscription_id,
            });

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error("Error changing subscription:", error);
            toast.error("Failed to change subscription plan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {showSuccessPopup && authUser?.email && (
                <SubscriptionSuccessPopup
                    email={authUser.email ?? ""}
                    onClose={() => setShowSuccessPopup(false)}
                />
            )}

            {showConfirmationPopup && selectedProductDetails && (
                <ChangeSubscriptionConfirmationPopup
                    onConfirm={handleConfirmSubscription}
                    onCancel={() => setShowConfirmationPopup(false)}
                    newPlanName={selectedProductDetails.name}
                    currentPlanName={activeProductDetails?.name}
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
                            const isCurrentPlan = _isExactPlanMatch({
                                activeStripePriceId,
                                isOneTimePaymentPlan,
                                selectedBillingCycle,
                                product,
                            });

                            const isDisabled = isCurrentPlan && !isOnFreeTrial;

                            return (
                                <div
                                    key={product.id}
                                    className={`relative rounded-lg border ${
                                        selectedPlan === product.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 bg-white"
                                    } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} p-4`}
                                    onClick={() => !isDisabled && setSelectedPlan(product.id)}
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
                                                    {isCurrentPlan && " (Current Plan)"}
                                                </div>
                                                <div className="text-gray-500">
                                                    {product.description}
                                                </div>
                                            </label>
                                        </div>
                                        <div className="text-right">
                                            <div className="whitespace-nowrap font-medium text-gray-700">
                                                {price
                                                    ? `${price.current} ${price.currency}`
                                                    : "N/A"}
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
                        <CustomButton
                            title={
                                !subscription
                                    ? TextConstants.TEXT__UNLOCK_PLAN
                                    : isOnFreeTrial
                                      ? TextConstants.TEXT__UPGRADE_PLAN
                                      : TextConstants.TEXT__CHANGE_PLAN
                            }
                            disabled={!selectedPlan || isLoading}
                            isLoading={isLoading}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChangeSubscriptionPlan;
