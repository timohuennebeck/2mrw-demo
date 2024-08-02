"use client";

import CustomButton from "@/components/CustomButton";
import { PreorderConfirmationContentSkeleton } from "@/components/ui/PreOrderSkeleton";
import { TextConstants } from "@/constants/TextConstants";
import { formatDateToHumanFormat } from "@/lib/helper/formatDateToHumanFormat";
import { checkUserProductPreorderStatus, fetchSupabaseUser } from "@/services/supabase/queries";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const PreorderConfirmationContent = () => {
    const { data: user, isLoading: userIsLoading } = useQuery({
        queryKey: ["supabaseUser"],
        queryFn: () => fetchSupabaseUser(),
        staleTime: 5 * 60 * 1000,
    });

    const { data, isLoading: preOrderStatusIsLoading } = useQuery({
        queryKey: ["preOrderStatus", { userId: user?.user?.id ?? "" }],
        queryFn: () => checkUserProductPreorderStatus({ userId: user?.user?.id ?? "" }),
        enabled: !!user?.user?.id,
    });

    const isLoading = userIsLoading || preOrderStatusIsLoading;

    if (isLoading) {
        return <PreorderConfirmationContentSkeleton />;
    }

    return (
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">
            <div className="mb-6 flex justify-center">
                <Image
                    src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""}
                    alt="Logo"
                    width={48}
                    height={48}
                />
            </div>

            <h1 className="mb-6 text-center text-2xl font-semibold">Thank You for Pre-Ordering!</h1>

            <p className="mb-2 text-center text-sm text-gray-600">
                Your '{data?.product?.name}' package has been reserved.
            </p>
            <p className="mb-4 text-center font-semibold">
                Purchased on:{" "}
                {formatDateToHumanFormat(data?.purchasedSubscription?.created_at ?? "")}
            </p>

            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <h2 className="mb-2 font-semibold">Order Details</h2>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Plan:</span> {data?.product?.name}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Price:</span> ${data?.product?.current_price}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Expected launch:</span> Q2 2024
                </p>
            </div>

            <p className="mb-8 text-center text-sm text-gray-600">
                You'll receive an email from us once Forj has been launched.
            </p>

            <CustomButton
                title="Send Us an Email"
                onClick={() =>
                    (window.location.href = `mailto:${TextConstants.TEXT__CUSTOMER_SUPPORT_EMAIL}`)
                }
            />

            <p className="mt-4 text-center text-sm text-gray-600">
                You have a question? Contact us at support@forj.com
            </p>
        </div>
    );
};

const PreorderConfirmationPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <PreorderConfirmationContent />
        </div>
    );
};

export default PreorderConfirmationPage;
