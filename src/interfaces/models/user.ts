export interface User {
    id: number;
    email: string;
    stripe_customer_id: string;
    profile_image_url: string;
    first_name: string;
    user_id: string;
    updated_at: Date;
    created_at: Date;
}
