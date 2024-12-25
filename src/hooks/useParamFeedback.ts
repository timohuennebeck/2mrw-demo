import { appConfig } from "@/config";
import { StatusMessage } from "@/interfaces";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface FeedbackConfig {
    param: string;
    type: StatusMessage["type"];
    message: string;
    duration?: number;
    action?: StatusMessage["action"];
    configKey?:
        | keyof typeof appConfig.feedback.widgets
        | keyof typeof appConfig.feedback.forms;
}

/**
 * Hook for handling status messages triggered by URL parameters such as "feedback=logged-out and feedback=account-deleted"
 *
 * This hook provides a way to show status messages based on URL search parameters:
 * - showing feedback after navigation events (e.g., successful logout or account deletion)
 *
 * Features:
 * - automatically clears URL parameters without page reload
 * - specific features can be enabled / disabled via appConfig
 * - supports action buttons within messages (e.g. "Share Feedback")
 */

export const useParamFeedback = (
    setStatusMessage: (message: StatusMessage | null) => void,
    config: FeedbackConfig,
) => {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("feedback") === config.param) {
            // clear the feedback parameter from URL without page reload
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("feedback");
            window.history.replaceState({}, "", newUrl);

            if (config.configKey) {
                // if the widget is disabled, don't show the message
                const widgetConfig =
                    appConfig.feedback.widgets[config.configKey];
                if (!widgetConfig.isEnabled) return;
            }

            setStatusMessage({
                type: config.type,
                message: config.message,
                ...(config.action && { action: config.action }),
            });

            if (config.duration !== 0) {
                // if duration is 0, message won't auto-clear
                setTimeout(() => {
                    setStatusMessage(null);
                }, config.duration ?? 5000);
            }
        }
    }, [searchParams, config, setStatusMessage]);
};
