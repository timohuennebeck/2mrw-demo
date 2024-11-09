import { Info, OctagonX } from "lucide-react";

type MessageType = "error" | "info";

interface FormStatusMessageProps {
    message: string;
    type?: MessageType;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const FormStatusMessage = ({ message, type = "error", action }: FormStatusMessageProps) => {
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
            {action && (
                <button
                    onClick={action.onClick}
                    className={`ml-auto rounded px-2 py-0.5 text-xs font-medium ${type === "error" ? "bg-red-100 hover:bg-red-200" : "bg-blue-100 hover:bg-blue-200"} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${type === "error" ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default FormStatusMessage;
