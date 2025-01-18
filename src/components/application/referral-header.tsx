import { TextConstants } from "@/constants/TextConstants";

interface ReferralHeaderProps {
    title: string;
    description: string;
    expiresIn: string;
    bonus: {
        label: string;
        amount: number;
    };
}

export const ReferralHeader = ({ title, description, expiresIn, bonus }: ReferralHeaderProps) => {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold text-blue-600">+{bonus.amount}</span>
                    <span className="text-sm text-blue-600">{bonus.label}</span>
                </div>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-sm font-medium text-orange-600">
                This referral expires in <span className="font-medium">{expiresIn}</span>
            </p>
        </>
    );
};
