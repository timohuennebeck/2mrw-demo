"use client";

import { EmailTester } from "@/components/application/EmailTester";
import { Card } from "@/components/ui/card";
import { Bug, Rocket } from "lucide-react";

const DemoPage = () => {
    const navigationItems = {
        "auth-success": [
            {
                label: "Email Confirmed",
                path: "/auth-status/success?mode=email-confirmed",
            },
            {
                label: "Google Connected",
                path: "/auth-status/success?mode=google-connected",
            },
            {
                label: "Password Updated",
                path: "/auth-status/success?mode=password-updated",
            },
            {
                label: "Email Updated",
                path: "/auth-status/success?mode=email-updated",
            },
        ],
        "auth-error": [
            {
                label: "Link Expired",
                path: "/auth-status/error?mode=token-expired",
            },
            {
                label: "Email Update",
                path: "/auth-status/error?mode=email-update",
            },
            {
                label: "Create User",
                path: "/auth-status/error?mode=create-user",
            },
            {
                label: "Google Sign In",
                path: "/auth-status/error?mode=google-auth",
            },
            {
                label: "Unexpected Error",
                path: "/auth-status/error?mode=unexpected-error",
            },
        ],
        billing: [
            {
                label: "Choose Plan",
                path: "/choose-pricing-plan",
            },
            {
                label: "Plan Confirmation",
                path: "/plan-confirmation",
            },
            {
                label: "Billing Page",
                path: "/app/billing",
            },
        ],
        onboarding: [
            {
                label: "Explore Flow",
                path: "/onboarding?step=1",
            },
        ],
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 space-y-8 p-8 pt-6">
                {/* Welcome Section */}
                <div className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-medium tracking-tight">Interactive Demo</h2>
                    <p className="text-muted-foreground">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est eveniet id
                        inventore?
                    </p>
                    <div className="inline-flex w-fit items-center gap-2 rounded-md bg-blue-50 px-4 py-2 text-sm text-blue-600">
                        <Rocket className="h-4 w-4" />
                        <span>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque non fugit
                            assumenda porro! Soluta, vel?
                        </span>
                    </div>
                </div>

                <EmailTester />

                {/* Project Explorer */}
                <div>
                    <Card className="border-gray-200 p-6 shadow-none hover:shadow-sm">
                        <div className="mb-6 flex items-center gap-2 text-sm">
                            <Bug className="h-4 w-4" />
                            <h3 className="font-medium">Project Explorer</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                    Success Pages
                                </h4>
                                <div className="flex flex-col space-y-1">
                                    {navigationItems["auth-success"].map((item) => (
                                        <button
                                            key={item.path}
                                            onClick={() => window.open(item.path, "_blank")}
                                            className="rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                    Error Pages
                                </h4>
                                <div className="flex flex-col space-y-1">
                                    {navigationItems["auth-error"].map((item) => (
                                        <button
                                            key={item.path}
                                            onClick={() => window.open(item.path, "_blank")}
                                            className="rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                    Billing Pages
                                </h4>
                                <div className="flex flex-col space-y-1">
                                    {navigationItems.billing.map((item) => (
                                        <button
                                            key={item.path}
                                            onClick={() => window.open(item.path, "_blank")}
                                            className="rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                    Onboarding Steps
                                </h4>
                                <div className="flex flex-col space-y-1">
                                    {navigationItems.onboarding.map((item) => (
                                        <button
                                            key={item.path}
                                            onClick={() => window.open(item.path, "_blank")}
                                            className="rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DemoPage;
