import { getStripeCustomerId, handleStripePortalSession } from "@/lib/stripe/stripeUtils";
import CustomButton from "../CustomButton";
import HeaderWithDescription from "../HeaderWithDescription";
import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";

const BillingPortal = () => {
    const { user } = useSession();

    const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
    const [isOpeningBillingPortal, setIsOpeningBillingPortal] = useState(false);

    useEffect(() => {
        const fetchStripeCustomerCreditCardDetails = async () => {
            if (!user?.email) return;

            const customerId = await getStripeCustomerId(user.email);
            setStripeCustomerId(customerId);
        };

        fetchStripeCustomerCreditCardDetails();
    }, [user]);

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
                    onClick={async () => {
                        setIsOpeningBillingPortal(true);
                        const url = await handleStripePortalSession(stripeCustomerId ?? "");
                        window.open(url ?? "", "_blank");
                        setIsOpeningBillingPortal(false);
                    }}
                    disabled={isOpeningBillingPortal}
                    isLoading={isOpeningBillingPortal}
                />
            </div>
        </div>
    );
};

export default BillingPortal;
