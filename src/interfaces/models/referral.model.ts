import { ReferralStatus } from "@/enums/referral";

export interface Referral {
    id: string;
    referrer_user_id: string;
    referred_email: string;
    referred_user_id: string;
    status: ReferralStatus;
    created_at: string;
    updated_at: string;
}