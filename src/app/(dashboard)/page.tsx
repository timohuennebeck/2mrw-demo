"use client";

import CustomPopup from "@/components/application/CustomPopup/CustomPopup";
import FormHeader from "@/components/application/FormHeader/FormHeader";
import useSuccessParam from "@/hooks/useSuccessParam";
import { Check } from "lucide-react";
import { useState } from "react";

const Home = () => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useSuccessParam({
        onSuccess: () => {
            setShowSuccessPopup(true);
        },
        redirectPath: "/",
    });

    return (
        <>
            {showSuccessPopup && (
                <CustomPopup
                    title="Subscription Confirmed!"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    icon={<Check size={32} strokeWidth={1.5} className="text-green-500" />}
                    iconBackgroundColor="bg-green-100"
                    mainButtonText="Continue"
                    onConfirm={() => setShowSuccessPopup(false)}
                    hideSecondaryButton
                    showConfetti
                />
            )}

            <div className="bg-white">
                <FormHeader
                    title="Home"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                    isPageHeader
                />
            </div>
            <div className="flex h-full w-full items-center justify-center">
                <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold">
                    src/app/page.tsx
                </code>
            </div>
        </>
    );
};

export default Home;
