export interface InputFieldParams {
    label: string;
    hideLabel?: boolean;
    disabled?: boolean;
    id: string;
    value?: string;
    type: string;
    name: string;
    dataTestId?: string;
    placeholder?: string;
    error?: string;
    hasError?: boolean;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}
