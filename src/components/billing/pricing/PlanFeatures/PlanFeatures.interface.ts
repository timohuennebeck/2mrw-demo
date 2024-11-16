interface Feature {
    id: string;
    name: string;
    description: string;
    isAvailable: boolean;
}

export interface PlanFeaturesParams {
    features: Feature[];
}