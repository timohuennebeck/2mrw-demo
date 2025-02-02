import ThemeToggle from "@/components/ui/theme-toggle";
import { appConfig } from "@/config";

const ThemeToggleSection = () => {
    if (!appConfig.themeToggle.isEnabled) return null;

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                    Customise the appearance of the app - choose between Light and Dark.
                </p>
            </div>
            <ThemeToggle />
        </div>
    );
};

export default ThemeToggleSection;
