import { AuthMethod } from "@/enums/user.enum";

export interface User {
    id: string;
    email: string;
    stripe_customer_id: string;
    profile_image_url: string;
    position: string;
    onboarding_completed: boolean;
    bio: string;
    auth_method: AuthMethod;
    referral_code: string;
    updated_at: Date;
    created_at: Date;
}
