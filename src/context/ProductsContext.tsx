import { Product } from "@/interfaces/ProductInterfaces";
import { fetchProducts } from "@/services/supabase/queries";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useSession } from "./SessionContext";

interface ProductsContextType {
    isLoading: boolean;
    products: Product[] | null;
}

const ProductsContext = createContext<ProductsContextType>({
    isLoading: true,
    products: null,
});

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
    const { authUserIsLoggedIn } = useSession();

    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: () => fetchProducts(),
        staleTime: 12 * 60 * 60 * 1000, // 12 hours
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        enabled: authUserIsLoggedIn,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return (
        <ProductsContext.Provider
            value={{
                isLoading,
                products: data?.products ?? null,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => useContext(ProductsContext);