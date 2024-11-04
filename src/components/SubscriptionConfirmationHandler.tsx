"use client";

import { useState } from "react";
import useSuccessParam from "@/hooks/useSuccessParam";
import CustomPopup from "@/components/CustomPopup";
import { Check } from "lucide-react";

const SubscriptionConfirmationHandler = () => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useSuccessParam({
        onSuccess: () => setShowSuccessPopup(true),
        redirectPath: "/",
    });

    return showSuccessPopup ? (
        <CustomPopup
            title="Subscription Confirmed!"
            description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
            icon={<Check size={32} strokeWidth={1.5} className="text-green-500" />}
            iconBackgroundColor="bg-green-100"
            mainButtonText="Continue"
            onConfirm={() => setShowSuccessPopup(false)}
            hideSecondaryButton
        />
    ) : null;
};

export default SubscriptionConfirmationHandler;
