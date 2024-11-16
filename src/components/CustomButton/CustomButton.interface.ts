export interface CustomButtonParams {
    title: string;
    className?: string;
    onClick?: () => void;
    isSecondary?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    dataTestId?: string;
}
