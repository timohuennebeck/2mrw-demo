import CustomButton from "./CustomButton";

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
                        <svg
                            className="h-8 w-8 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="mb-2 text-2xl font-semibold">Subscription Confirmed!</h2>

                <p className="mb-6 text-gray-600">
                    Thanks for subscribing. Your subscription has been activated. The confirmation
                    email has been sent to {email}.
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
