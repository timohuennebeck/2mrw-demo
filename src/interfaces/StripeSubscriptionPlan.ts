interface Feature {
    name: string;
    included: boolean;
}

export interface StripeSubscriptionPlan {
    name: string;
    description: string;
    additionalInfo: string;
    previousPrice: number;
    price: number;
    stripePriceId: string;
    stripePaymentLink: string;
    buttonCta: string;
    features: Feature[];
    isHighlighted: boolean;
}
