import { appConfig, emailConfig } from "@/config";
import { emailRequestSchema, emailSchemas } from "@/interfaces/services/resend";
import { ReactElement } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
