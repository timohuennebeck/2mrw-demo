import { appConfig } from "@/config";
import { Bug, SmilePlus } from "lucide-react";

export const FeedbackSection = () => {
    const { feedback } = appConfig;

    if (!feedback.bugReport.isEnabled && !feedback.featureRequest.isEnabled) return null;

    return (
        <div>
            <h3 className="mb-3 text-base font-semibold">Help Us Improve</h3>
            <div className="grid grid-cols-2 gap-4">
                {feedback.bugReport.isEnabled && (
                    <a className="group" href="https://tally.so/r/3xRjW9" target="_blank">
                        <div className="flex flex-col items-center rounded-lg border p-4 text-center transition-colors dark:border-border dark:bg-background">
                            <Bug
                                className="mb-2 h-7 w-7 transition-transform group-hover:scale-110"
                                strokeWidth={1.5}
                            />
                            <h4 className="mb-1 font-medium">Report a Bug</h4>
                            <p className="text-sm text-muted-foreground">
                                Found an issue? Help us fix it by reporting details.
                            </p>
                        </div>
                    </a>
                )}
                {feedback.featureRequest.isEnabled && (
                    <a className="group" href="https://tally.so/r/w86zBo" target="_blank">
                        <div className="flex flex-col items-center rounded-lg border p-4 text-center transition-colors dark:border-border dark:bg-background">
                            <SmilePlus
                                className="mb-2 h-7 w-7 transition-transform group-hover:scale-110"
                                strokeWidth={1.5}
                            />
                            <h4 className="mb-1 font-medium">Request a Feature</h4>
                            <p className="text-sm text-muted-foreground">
                                Have an idea to improve our product? Share your suggestion.
                            </p>
                        </div>
                    </a>
                )}
            </div>
        </div>
    );
};
