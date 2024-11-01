import { createClient } from "@/services/supabase/client";

export const getPurchasedProductName = async (subscriptionTier: string) => {
    const supabase = createClient();

    const { data: packageData, error: packageError } = await supabase
        .from("products")
        .select("name")
        .eq("subscription_tier", subscriptionTier)
        .single();

    if (packageError) throw packageError;

    return packageData.name;
};
