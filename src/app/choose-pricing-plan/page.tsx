import { PricingPlanCard } from "@/components/PricingPlanCard";
import SignOutButton from "@/components/SignOutButton";
import { TextConstants } from "@/constants/TextConstants";
import { Product } from "@/interfaces/ProductInterfaces";
import { fetchProducts, fetchSupabaseUser } from "@/lib/supabase/queries";
import Image from "next/image";
import { Suspense } from "react";

const getProducts = async () => {
    const { products, error } = await fetchProducts();

    if (error) throw error;

    return products;
};

const ChoosePricingPlanPage = async () => {
    const [products, user] = await Promise.all([getProducts(), fetchSupabaseUser()]);
    const userEmail = user.user?.email ? encodeURIComponent(user.user?.email) : "";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="absolute top-8 right-8">
                <SignOutButton title="Sign out" />
            </div>

            <div className="p-8 max-w-4xl w-full">
                <div className="flex justify-center mb-6">
                    <Image
                        src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""}
                        alt="Logo"
                        width={48}
                        height={48}
                    />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-2">Choose a Plan</h1>
                <p className="text-center text-gray-600 mb-8 text-sm">
                    Choose a plan to start using {TextConstants.TEXT__COMPANY_TITLE}. This is a
                    one-time purchase not a subscription. You can still upgrade your plan later if
                    needed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {products?.map((product: Product, index) => (
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
            </div>
        </div>
    );
};

export default ChoosePricingPlanPage;
