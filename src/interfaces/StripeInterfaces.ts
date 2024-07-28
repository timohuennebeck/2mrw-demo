export interface VerifyStripeWebhookParams {
    body: string;
    signature: string;
}

export interface InitiateStripeCheckoutProcessParams {
    userId: string;
    userEmail: string;
    stripePriceId: string;
}
