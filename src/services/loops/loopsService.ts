"use server";

import { EmailType } from "@/enums/email";
import { TextConstants } from "@/constants/TextConstants";
import { loopsClient } from "./client";
import { emailConfig } from "@/config";
import { EmailVariablesMap } from "@/interfaces/services/email";

interface SendEmailParams<T extends EmailType> {
    type: T;
    email: string;
    variables: EmailVariablesMap[T];
}

export const sendLoopsTransactionalEmail = async <T extends EmailType>({
    type,
    email,
    variables,
}: SendEmailParams<T>) => {
    const template = emailConfig.templates[type];

    if (!template?.enabled) {
        console.log("Email type is disabled:", type);
        return { success: false, error: "Email template is disabled" };
    }

    try {
        await loopsClient.post("/transactional", {
            transactionalId: template.transactionalId,
            email,
            dataVariables: variables,
        });

        return { success: true, error: null };
    } catch (error) {
        console.error("Error sending email:", error);

        return {
            success: false,
            error: error instanceof Error
                ? error.message
                : TextConstants.ERROR__UNEXPECTED_ERROR,
        };
    }
};
