"use client";

import { Product } from "@/interfaces/Product";
import { fetchProducts } from "@/utils/supabase/queries";
import { useEffect, useState } from "react";

export const extractSubscriptionPlanDetails = async (stripePriceId: string) => {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProductsFromSupabase = async () => {
        try {
            const { products, error } = await fetchProducts();

            if (error) throw error;

            if (products) setProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error);

            return { plan: null, error };
        }
    };

    useEffect(() => {
        fetchProductsFromSupabase();
    }, []);

    const plan = products.find((plan) => plan.stripe_price_id === stripePriceId);

    if (!plan) {
        throw new Error(`Error, no plan found for price id: ${stripePriceId}`);
    }

    return { plan, error: null };
};
