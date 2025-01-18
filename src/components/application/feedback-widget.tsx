import { SmilePlus } from "lucide-react";
import { Button } from "../ui/button";
import { appConfig } from "@/config";

const FeedbackWidget = () => {
    return (
        <Button
            onClick={() => window.open(appConfig.feedback.widgets.shareFeedback.formUrl, "_blank")}
            variant="default"
            size="sm"
            className="group shadow-sm"
        >
            <SmilePlus className="h-4 w-4 transition-transform group-hover:rotate-12" />
            Share Feedback
        </Button>
    );
};

export default FeedbackWidget;
