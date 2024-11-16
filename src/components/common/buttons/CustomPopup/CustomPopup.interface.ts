export interface CustomPopupParams {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBackgroundColor?: string;
    mainButtonColor?: string;
    mainButtonText?: string;
    mainButtonIsLoading?: boolean;
    hideSecondaryButton?: boolean;
    showConfetti?: boolean;
    dataTestId?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}
