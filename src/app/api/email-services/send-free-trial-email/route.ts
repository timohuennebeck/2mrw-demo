import { TextConstants } from "@/constants/TextConstants";
import FreeTrialEmailTemplate from "@/emails/FreeTrialEmailTemplate";
import { NextRequest as request, NextResponse as response } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_EMAIL_API_KEY ?? "");

export const POST = async (req: request) => {
    try {
        const { userEmail, userFirstName } = await req.json();

        if (!userEmail || !userFirstName) {
            return response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: TextConstants.EMAIL__SEND_FROM,
            to: userEmail,
            subject: `Welcome to ${TextConstants.EMAIL__COMPANY_TITLE}!`,
            react: FreeTrialEmailTemplate({
                userFirstName: userFirstName,
                companyTitle: TextConstants.EMAIL__COMPANY_TITLE,
                trialDuration: TextConstants.EMAIL__FREE_TRIAL_DURATION,
                trialSignupLink: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan?welcomeEmail=true`,
                twitterFounderUrl: TextConstants.EMAIL__TWITTER_FOUNDER_URL,
                twitterFounderTag: TextConstants.TEXT__TWITTER_FOUNDER_TAG,
            }),
        });

        if (error) {
            console.error("Failed to send email:", error);
            return response.json({ error: "Email sending failed" }, { status: 500 });
        }

        return response.json({ message: "Email has been sent", data }, { status: 200 });
    } catch (error) {
        console.error("Unexpected error while sending email:", error);
        return response.json({ error: "Failed to send email" }, { status: 500 });
    }
};
