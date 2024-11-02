export interface VerifyStripeWebhookParams {
    body: string;
    signature: string;
}

export interface InitiateStripeCheckoutProcessParams {
    userEmail: string;
    stripePriceId: string;
    successUrl: string;
    cancelUrl: string;
}
