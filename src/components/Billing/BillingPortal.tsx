import { getStripeCustomerId, handleStripePortalSession } from "@/lib/stripe/stripeUtils";
import CustomButton from "../CustomButton";
import HeaderWithDescription from "../HeaderWithDescription";
import { useState } from "react";
import { useSession } from "@/context/SessionContext";

const BillingPortal = () => {
    const { authUser } = useSession();

    const [isOpeningBillingPortal, setIsOpeningBillingPortal] = useState(false);

    const handlePortalOpen = async () => {
        setIsOpeningBillingPortal(true);

        if (!authUser?.email || !authUser?.id) return;

        const stripeCustomerId = await getStripeCustomerId(authUser.email, authUser.id);

        const url = await handleStripePortalSession(stripeCustomerId ?? "");
        if (url) {
            window.open(url, "_blank");
        }
        setIsOpeningBillingPortal(false);
    };

    return (
        <div>
            <HeaderWithDescription
                title="Manage Your Billing Information"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam et odit autem alias aut praesentium vel nisi repudiandae saepe consectetur!"
            />
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                    <p className="text-sm font-medium text-gray-700">Billing Portal</p>
                    <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet.</p>
                </div>
                <CustomButton
                    title="Billing Portal"
                    onClick={handlePortalOpen}
                    disabled={isOpeningBillingPortal}
                    isLoading={isOpeningBillingPortal}
                />
            </div>
        </div>
    );
};

export default BillingPortal;
