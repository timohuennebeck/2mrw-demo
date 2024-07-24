export interface Product {
    id: number;
    name: string;
    description: string;
    additional_info: string;
    previous_price: number;
    current_price: number;
    stripe_price_id: string;
    stripe_purchase_link: string;
    is_highlighted: boolean;
    created_at: Date;
    updated_at: Date;
};