"use client";

import { useState, useEffect } from "react";
import { Product } from "@/interfaces/Product";
import { fetchProducts } from "@/utils/supabase/queries";

export const useProductCache = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProductsFromSupabase = async () => {
            try {
                const { products, error } = await fetchProducts();

                if (error) throw error;

                setProducts(products);
            } catch (err) {
                setError("There has been an error");
            }
        };

        fetchProductsFromSupabase();
    }, []);

    return { products, error };
};
