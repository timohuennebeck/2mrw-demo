export interface User {
    id: string;
    email: string;
    stripe_customer_id: string;
    profile_image_url: string;
    first_name: string;
    position: string;
    bio: string;
    updated_at: Date;
    created_at: Date;
}
