import { SmilePlus } from "lucide-react";
import { Button } from "../ui/button";
import { appConfig } from "@/config";

const FeedbackWidget = () => {
    return (
        <div className="fixed bottom-4 right-8">
            <Button
                onClick={() => window.open(appConfig.feedback.formUrl, "_blank")}
                variant="default"
                size="sm"
            >
                <SmilePlus className="h-4 w-4" />
                Share Feedback
            </Button>
        </div>
    );
};

export default FeedbackWidget;
