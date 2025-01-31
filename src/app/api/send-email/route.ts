import { EmailType } from "@/enums";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailSchemas = {
    [EmailType.FREE_TRIAL_STARTED]: {
        enabled: false,
        variables: ["freeTrialEndDate"],
    },
    [EmailType.FREE_TRIAL_EXPIRES_SOON]: {
        enabled: false,
        variables: ["upgradeUrl"],
    },
    [EmailType.REFERRAL_INVITE]: {
        enabled: false,
        variables: ["referralUrl"],
    },
};

export const POST = async (req: Request) => {
    const body = req.json;

    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            react: EmailTemplate(templateVariables),
        });

        return data
            ? Response.json(data)
            : Response.json({ error }, { status: 500 });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
};
