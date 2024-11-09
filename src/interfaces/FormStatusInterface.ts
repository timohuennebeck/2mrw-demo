export interface StatusMessage {
    type: "error" | "info";
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    countdown?: number;
}
