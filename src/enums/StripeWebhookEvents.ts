export enum StripeWebhookEvents {
    CHECKOUT_SESSION_COMPLETED = "checkout.session.completed",
    CHECKOUT_SESSION_EXPIRED = "checkout.session.expired",
    INVOICE_PAID = "invoice.paid",
    INVOICE_PAYMENT_FAILED = "invoice.payment_failed",
    CUSTOMER_SUBSCRIPTION_UPDATED = "customer.subscription.updated",
    CUSTOMER_SUBSCRIPTION_DELETED = "customer.subscription.deleted",
}
