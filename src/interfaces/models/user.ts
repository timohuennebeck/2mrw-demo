import { AuthMethod } from "@/enums/user";

export interface User {
    id: string;
    email: string;
    stripe_customer_id: string;
    profile_image_url: string;
    position: string;
    onboarding_completed: boolean;
    bio: string;
    auth_method: AuthMethod;
    updated_at: Date;
    created_at: Date;
}
