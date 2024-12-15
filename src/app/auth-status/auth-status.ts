export type StatusType = "error" | "success";

export interface StatusConfig {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    primaryButton: {
        href: string;
        label: string;
    };
}

export interface StatusPageProps {
    type: StatusType;
    config: StatusConfig;
}
