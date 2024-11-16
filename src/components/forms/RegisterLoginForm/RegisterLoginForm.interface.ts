import { StatusMessage } from "@/interfaces";

export interface RegisterLoginFormParams {
    mode: string;
    handleSubmit: ({
        email,
        password,
        firstName,
    }: {
        email: string;
        password: string;
        firstName: string;
    }) => void;
    loginWithMagicLink?: (email: string) => void;
    isLoading: boolean;
    statusMessage?: StatusMessage | null;
}
