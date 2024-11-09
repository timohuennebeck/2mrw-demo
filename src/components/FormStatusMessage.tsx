import { Info, OctagonX } from "lucide-react";

type MessageType = "error" | "info";

interface FormStatusMessageProps {
    message: string;
    type?: MessageType;
}

const FormStatusMessage = ({ message, type = "error" }: FormStatusMessageProps) => {
    if (!message) return null;

    const styles = {
        error: {
            background: "bg-red-50",
            text: "text-red-500",
            icon: <OctagonX className="h-5 w-5" />,
        },
        info: {
            background: "bg-blue-50",
            text: "text-blue-500",
            icon: <Info className="h-5 w-5" />,
        },
    };

    const { background, text, icon } = styles[type];

    return (
        <div className={`flex items-center gap-2 rounded-md ${background} p-3 text-sm ${text}`}>
            {icon}
            <p>{message}</p>
        </div>
    );
};

export default FormStatusMessage;