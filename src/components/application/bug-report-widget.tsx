import { Bug } from "lucide-react";
import { Button } from "../ui/button";
import { appConfig } from "@/config";

const BugReportWidget = () => {
    return (
        <Button
            onClick={() => window.open(appConfig.feedback.widgets.reportBug.formUrl, "_blank")}
            variant="outline"
            size="sm"
            className="group"
        >
            <Bug className="h-4 w-4 transition-transform group-hover:rotate-12" />
            Report Bug
        </Button>
    );
};

export default BugReportWidget;
