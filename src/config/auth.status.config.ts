import { StatusConfig } from "@/app/auth-status/authStatus";
import { TextConstants } from "@/constants/TextConstants";
import { appConfig } from "./app.config";

const ERROR_KEYS = [
    "token-expired",
    "email-update",
    "create-user",
    "google-auth",
    "unexpected-error",
] as const;

const SUCCESS_KEYS = [
    "email-confirmed",
    "google-connected",
    "password-updated",
    "email-updated",
] as const;

type ErrorType = (typeof ERROR_KEYS)[number];
type SuccessType = (typeof SUCCESS_KEYS)[number];

export const ERROR_TYPES: { [K in ErrorType]: StatusConfig } = {
    "token-expired": {
        badge: "LINK ERROR",
        title: "Link",
        highlight: "Has Expired",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/auth/sign-in?method=magic-link",
            label: "Request New Link",
        },
    },
    "email-update": {
        badge: "UPDATE ERROR",
        title: "Email Update",
        highlight: "Failed",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/app/user-profile",
            label: "Back to Profile",
        },
    },
    "create-user": {
        badge: "DATABASE ERROR",
        title: "User",
        highlight: "Creation Failed",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/auth/sign-in?method=magic-link",
            label: "Try Again",
        },
    },
    "google-auth": {
        badge: "GOOGLE ERROR",
        title: "Google Sign-in",
        highlight: "Failed",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/auth/sign-in?method=magic-link",
            label: "Back to Sign In",
        },
    },
    "unexpected-error": {
        badge: "ERROR",
        title: "Unexpected",
        highlight: "Error",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/auth/sign-in?method=magic-link",
            label: "Back to Sign In",
        },
    },
};

export const SUCCESS_TYPES: { [K in SuccessType]: StatusConfig } = {
    "email-confirmed": {
        badge: "EMAIL CONFIRMED",
        title: "Email",
        highlight: "Confirmed",
        description:
            `Your email has been confirmed. You can now continue using ${appConfig.company.name}.`,
        primaryButton: {
            href: "/choose-pricing-plan",
            label: "Continue",
        },
    },
    "google-connected": {
        badge: "GOOGLE CONNECTED",
        title: "Google",
        highlight: "Connected",
        description:
            `Your Google account has been connected. You can now continue using ${appConfig.company.name}.`,
        primaryButton: {
            href: "/app",
            label: "Continue",
        },
    },
    "password-updated": {
        badge: "PASSWORD UPDATED",
        title: "Password",
        highlight: "Updated",
        description:
            `Your password has been updated. You can now continue using ${appConfig.company.name}.`,
        primaryButton: {
            href: "/app",
            label: "Continue",
        },
    },
    "email-updated": {
        badge: "EMAIL UPDATED",
        title: "Email",
        highlight: "Updated",
        description:
            `Your email has been updated. You can now continue using ${appConfig.company.name}.`,
        primaryButton: {
            href: "/app/user-profile",
            label: "Continue to Profile",
        },
    },
};
