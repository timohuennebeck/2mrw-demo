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
                className="group"
            >
                <SmilePlus className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Share Feedback
            </Button>
        </div>
    );
};

export default FeedbackWidget;