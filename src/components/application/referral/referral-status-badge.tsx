import { Badge } from "@/components/ui/badge";
import { ReferralStatus } from "@/enums/referral";
import { CircleCheck, Clock } from "lucide-react";

interface ReferralStatusBadgeProps {
    status: ReferralStatus;
}

export const ReferralStatusBadge = ({ status }: ReferralStatusBadgeProps) => {
    if (status === ReferralStatus.COMPLETED) {
        return (
            <Badge variant="blue" className="gap-2 rounded-sm text-sm font-normal">
                <CircleCheck className="h-4 w-4 fill-blue-600 stroke-white text-blue-600" />
                +25 Tokens
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className="gap-2 rounded-sm text-sm font-normal">
            <Clock className="h-4 w-4 fill-gray-600 stroke-white text-gray-600" />
            Pending
        </Badge>
    );
};
