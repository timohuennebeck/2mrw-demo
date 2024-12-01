"use client";

import CustomPopup from "@/components/application/CustomPopup";
import FormHeader from "@/components/application/FormHeader";
import { CustomBarChart } from "@/components/charts/CustomBarChart";
import { CustomLinearLineChart } from "@/components/charts/CustomLinearLineChart";
import { CustomLineChart } from "@/components/charts/CustomLineChart";
import { CustomPieChart } from "@/components/charts/CustomPieChart";
import useSuccessParam from "@/hooks/useSuccessParam";
import { Check } from "lucide-react";
import { Suspense, useState } from "react";

const SuccessHandler = ({ onSuccess }: { onSuccess: () => void }) => {
    useSuccessParam({
        onSuccess,
        redirectPath: "/dashboard",
    });
    return null;
};

const Home = () => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    return (
        <>
            <Suspense fallback={null}>
                <SuccessHandler onSuccess={() => setShowSuccessPopup(true)} />
            </Suspense>

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
                    onCancel={() => setShowSuccessPopup(false)}
                />
            )}

            <FormHeader
                title="Home"
                description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem ratione, fugit quos accusantium exercitationem perspiciatis!"
                isPageHeader
            />

            <div className="mb-4 flex gap-4">
                <CustomLinearLineChart />
                <CustomBarChart />
                <CustomPieChart />
            </div>

            <CustomLineChart />
        </>
    );
};

export default Home;