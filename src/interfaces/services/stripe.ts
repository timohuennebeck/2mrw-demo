export interface VerifyStripeWebhookParams {
    body: string;
    signature: string;
}

export interface InitiateStripeCheckoutProcessParams {
    stripePriceId: string;
    successUrl: string;
    cancelUrl: string;
    existingSubscriptionId?: string;
}
