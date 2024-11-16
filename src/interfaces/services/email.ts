import Stripe from "stripe";

export interface SendPostPurchaseEmailParams {
    session: Stripe.Checkout.Session;
    stripePriceId: string;
}

export interface EmailTemplateProps {
    userEmail: string;
    userFirstName: string;
    purchasedPackage?: string;
}

export interface SocialLinks {
    twitter: {
        founder: {
            url: string;
            tag: string;
        };
        company: {
            url: string;
            tag: string;
        };
    };
}

export interface CompanyInfo {
    name: string;
    supportEmail: string;
    senderEmail: string;
    logoUrl: string;
}

export interface EmailSettings {
    subscriptionConfirmationEmail: {
        subject: string;
        isEnabled: boolean;
    };
}
