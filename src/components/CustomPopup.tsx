import CustomButton from "./CustomButton";
import { AlertTriangle } from "lucide-react";

interface CustomPopupProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBackgroundColor?: string;
    mainButtonColor?: string;
    mainButtonText?: string;
    hideSecondaryButton?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
}

const CustomPopup = ({
    title,
    description,
    icon,
    iconBackgroundColor,
    mainButtonColor,
    mainButtonText = "Confirm",
    hideSecondaryButton,
    onConfirm,
    onCancel,
}: CustomPopupProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
                <div className="mb-6 flex justify-center">
                    {icon && (
                        <div className={`rounded-full p-3 ${iconBackgroundColor}`}>{icon}</div>
                    )}
                </div>

                <h2 className="mb-2 text-2xl font-semibold">{title}</h2>

                <p className="mb-6 text-gray-600">{description}</p>

                <div className="flex justify-center space-x-4">
                    {!hideSecondaryButton && (
                        <CustomButton title="Cancel" onClick={onCancel} isSecondary />
                    )}
                    <CustomButton
                        title={mainButtonText}
                        onClick={onConfirm}
                        className={mainButtonColor}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomPopup;
