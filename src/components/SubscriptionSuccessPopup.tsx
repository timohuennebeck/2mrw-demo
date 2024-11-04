import CustomButton from "./CustomButton";
import { Check } from "lucide-react";

interface SubscriptionSuccessPopupProps {
    email: string;
    onClose?: () => void;
}

const SubscriptionSuccessPopup = ({ email, onClose }: SubscriptionSuccessPopupProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3">
                        <Check size={32} strokeWidth={1.5} className="text-green-500" />
                    </div>
                </div>

                <h2 className="mb-2 text-2xl font-semibold">Subscription Confirmed!</h2>

                <p className="mb-6 text-gray-600">
                    Thanks for subscribing. Your subscription has been activated. The confirmation
                    email has been sent to <span className="font-medium">{email}</span>.
                </p>

                <div className="flex justify-center">
                    <CustomButton
                        title="Continue"
                        onClick={() => {
                            if (onClose) {
                                onClose();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSuccessPopup;
