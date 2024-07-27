import { FreeTrialStatus } from "@/enums/FreeTrialStatus";

export interface EndOnGoingUserFreeTrialParams {
    status: FreeTrialStatus | null;
    userId: string;
}
export interface FreeTrial {
    id: number;
    start_date: string;
    end_date: string;
    stripe_price_id: string;
    user_id: string;
    status: FreeTrialStatus;
}
