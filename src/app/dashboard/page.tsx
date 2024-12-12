"use client";

import { CustomBarChart } from "@/components/charts/CustomBarChart";
import { CustomLinearLineChart } from "@/components/charts/CustomLinearLineChart";
import { CustomLineChart } from "@/components/charts/CustomLineChart";
import { CustomPieChart } from "@/components/charts/CustomPieChart";

const Home = () => {
    return (
        <>
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
