import ReactConfetti from "react-confetti";
import CustomButton from "@/components/application/CustomButton/CustomButton";
import { CustomPopupParams } from "./CustomPopup.interface";

const CustomPopup = ({
    title,
    description,
    icon,
    iconBackgroundColor,
    mainButtonColor,
    mainButtonText = "Confirm",
    mainButtonIsLoading,
    hideSecondaryButton,
    showConfetti = false,
    dataTestId,
    onConfirm,
    onCancel,
}: CustomPopupParams) => {
    return (
        <>
            {showConfetti && (
                <ReactConfetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}

            <div
                data-testid={dataTestId}
                className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-gray-800/50"
            >
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
                            <CustomButton
                                title="Cancel"
                                onClick={onCancel}
                                isSecondary
                                dataTestId="custom-popup-secondary-button"
                            />
                        )}
                        <CustomButton
                            title={mainButtonText}
                            onClick={onConfirm}
                            className={mainButtonColor}
                            isLoading={mainButtonIsLoading}
                            disabled={mainButtonIsLoading}
                            dataTestId="custom-popup-primary-button"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomPopup;
