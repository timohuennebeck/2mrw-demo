import CustomButton from "./CustomButton";
import { ShieldAlert } from "lucide-react";

interface ChangeSubscriptionConfirmationPopupProps {
    onConfirm: () => void;
    onCancel: () => void;
    newPlanName: string;
    currentPlanName?: string;
}

const ChangeSubscriptionConfirmationPopup = ({
    onConfirm,
    onCancel,
    newPlanName,
    currentPlanName,
}: ChangeSubscriptionConfirmationPopupProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-yellow-100 p-3">
                        <ShieldAlert size={32} strokeWidth={1.5} className="text-yellow-500" />
                    </div>
                </div>

                <h2 className="mb-2 text-2xl font-semibold">Confirm Subscription Change</h2>

                <p className="mb-6 text-gray-600">
                    {currentPlanName ? (
                        <>
                            Please confirm the switch from{" "}
                            <span className="font-medium">{currentPlanName}</span> to{" "}
                            <span className="font-medium">{newPlanName}</span>?
                        </>
                    ) : (
                        <>
                            Please confirm the subscription to{" "}
                            <span className="font-medium">{newPlanName}</span>?
                        </>
                    )}
                </p>

                <div className="flex justify-center space-x-4">
                    <CustomButton title="Cancel" onClick={onCancel} isSecondary />

                    <CustomButton title="Confirm" onClick={onConfirm} />
                </div>
            </div>
        </div>
    );
};

export default ChangeSubscriptionConfirmationPopup;
