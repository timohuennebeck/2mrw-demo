import { PricingPlanCard } from "@/components/PricingPlanCard";
import SignOutButton from "@/components/SignOutButton";
import { fetchProducts } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Suspense, cache } from "react";

const getProducts = cache(async () => {
    const { products, error } = await fetchProducts();

    if (error) throw error;

    return products;
});

const getUser = cache(async () => {
    const supabase = createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return user;
});

const ChoosePricingPlanPage = async () => {
    const [products, user] = await Promise.all([getProducts(), getUser()]);

    const userEmail = user?.email ? encodeURIComponent(user.email) : "";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="absolute top-8 right-8">
                <SignOutButton title="Sign out" />
            </div>

            <div className="p-8 max-w-4xl w-full">
                <div className="flex justify-center mb-6">
                    <Image
                        src={process.env.EMAIL_LOGO_BASE_URL ?? ""}
                        alt="Logo"
                        width={48}
                        height={48}
                    />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-2">Choose a Plan</h1>
                <p className="text-center text-gray-600 mb-8 text-sm">
                    Choose a plan to start using Forj. This is a one-time purchase not a
                    subscription. You can still upgrade your plan later if needed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {products?.map((product, index) => (
                        <Suspense key={index}>
                            <PricingPlanCard
                                {...product}
                                stripe_purchase_link={
                                    userEmail
                                        ? `${product.stripe_purchase_link}?prefilled_email=${userEmail}`
                                        : product.stripe_purchase_link
                                }
                            />
                        </Suspense>
                    ))}
                </div>

                <p className="text-center text-gray-600 mb-8 text-sm">
                    This limited offer ends November 8th, 2024 at 12 AM CET.
                </p>
            </div>
        </div>
    );
};

export default ChoosePricingPlanPage;
