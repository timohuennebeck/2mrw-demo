"use client";

import { CustomBarChart } from "@/components/charts/CustomBarChart";
import { CustomLinearLineChart } from "@/components/charts/CustomLinearLineChart";
import { CustomLineChart } from "@/components/charts/CustomLineChart";
import { CustomPieChart } from "@/components/charts/CustomPieChart";
import useSuccessParam from "@/hooks/useSuccessParam";
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
