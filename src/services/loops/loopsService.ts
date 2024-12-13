"use server";

import { EmailType } from "@/enums/email";
import { TextConstants } from "@/constants/TextConstants";
import { loopsClient } from "./client";
import { emailConfig } from "@/config/emailConfig";
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
        return { data: null, error: "Email template is disabled" };
    }

    try {
        await loopsClient.post("/transactional", {
            transactionalId: template.transactionalId,
            email,
            dataVariables: variables,
        });

        return { data: TextConstants.TEXT__EMAIL_HAS_BEEN_SENT, error: null };
    } catch (error) {
        console.error("Error sending email:", error);

        return {
            data: null,
            error: error instanceof Error ? error.message : TextConstants.ERROR__UNEXPECTED_ERROR,
        };
    }
};
