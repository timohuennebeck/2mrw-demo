export interface OnboardingTaskConfig {
    id: string;
    title: string;
    description: string;
    reward: {
        amount: number;
        unit: string;
    };
    action: {
        label: string;
        href: string;
    };
    completionCheck: {
        field: string; // e.g. "uploadedProductDemos", "referralCount", etc.
        target: number; // e.g. 2, 5, 10, etc. so the value the user needs to reach to complete the task
    };
    disabled?: boolean;
    requiresPrevious?: boolean;
    referralSteps?: number; // optional: for tasks that need step tracking
}

export interface OnboardingConfig {
    title: string;
    description?: string;
    bonusReward?: {
        amount: number;
        unit: string;
    };
    tasks: OnboardingTaskConfig[];
}

export const onboardingConfig = {
    title: "Getting Started",
    description: "Finish all onboarding tasks to earn an extra",
    bonusReward: {
        amount: 25,
        unit: "tokens",
    },
    tasks: [
        {
            id: "upload-demo",
            title: "Upload a Product Demo",
            description: "Upload a product demo to get started",
            reward: {
                amount: 2,
                unit: "tokens",
            },
            action: {
                label: "Upload Demo",
                href: "/app/product-demos",
            },
            completionCheck: {
                field: "uploadedProductDemos",
                target: 1,
            },
        },
        {
            id: "invite-friends",
            title: "Invite 5 Friends",
            description: "Invite friends to join the platform",
            reward: {
                amount: 15,
                unit: "tokens per referral",
            },
            action: {
                label: "Invite 5 Friends",
                href: "/app/refer",
            },
            completionCheck: {
                field: "referralCount",
                target: 5,
            },
            referralSteps: 5,
        },
    ],
} as const satisfies OnboardingConfig; // uses satisfies as we otherwise can't use as const type assertion

export type CompletionCheckField =
    typeof onboardingConfig.tasks[number]["completionCheck"]["field"];
