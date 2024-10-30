import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
export interface FreeTrial {
    id: number;
    start_date: string;
    end_date: string;
    stripe_price_id: string;
    user_id: string;
    status: FreeTrialStatus;
    created_at: string;
    updated_at: string;
}
