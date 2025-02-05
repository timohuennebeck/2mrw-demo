import { appConfig } from "@/config";
import { EmailType } from "@/enums";
import { emailRequestSchema, emailSchemas } from "@/interfaces/services/resend";
import { ReactElement } from "react";
import { z } from "zod";
import FreeTrialStartedEmail from "../../../../emails/free-trial-started";
import FreeTrialExpiresEmail from "../../../../emails/free-trial-expires-soon";
import ReferralInviteEmail from "../../../../emails/referral-invite";
import { resend } from "@/services/resend/client";

type EmailSchemaType = {
    [K in EmailType]: z.infer<typeof emailSchemas[K]>;
};

type EmailConfigType = {
    [K in EmailType]: {
        component: (props: EmailSchemaType[K]) => ReactElement;
        isEnabled: boolean;
    };
};

const emailConfig: EmailConfigType = {
    [EmailType.FREE_TRIAL_STARTED]: {
        component: FreeTrialStartedEmail,
        isEnabled: true,
    },
    [EmailType.FREE_TRIAL_EXPIRES_SOON]: {
        component: FreeTrialExpiresEmail,
        isEnabled: true,
    },
    [EmailType.REFERRAL_INVITE]: {
        component: ReferralInviteEmail,
        isEnabled: false,
    },
};

export const POST = async (req: Request) => {
    const { to, subject, emailType, variables } = emailRequestSchema
        .parse(req.json);

    if (!emailConfig[emailType].isEnabled) {
        return Response.json({
            error: `Email type '${emailType}' is currently disabled`,
        }, { status: 403 });
    }

    const variablesFromSchema = emailSchemas[emailType].parse(variables);
    const EmailComponent = emailConfig[emailType].component as (
        props: typeof variablesFromSchema,
    ) => ReactElement;

    try {
        const { data, error } = await resend.emails.send({
            from: appConfig.company.senderEmail,
            to,
            subject,
            react: EmailComponent(variablesFromSchema),
        });

        return data
            ? Response.json({ data }, { status: 200 })
            : Response.json({ error }, { status: 500 });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
};
