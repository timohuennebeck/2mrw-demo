import FreeTrialEmailTemplate from "@/emails/FreeTrialEmailTemplate";
import { NextRequest as request, NextResponse as response } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_EMAIL_API_KEY ?? "");

export const POST = async (req: request) => {
    try {
        const { userEmail, userFullName } = await req.json();

        if (!userEmail || !userFullName) {
            return response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: "info@updates.joinforj.com",
            to: userEmail,
            subject: `Welcome to Forj!`,
            react: FreeTrialEmailTemplate({
                userFirstName: userFullName,
                companyTitle: "Forj",
                trialDuration: 14,
                trialSignupLink: `${process.env.NEXT_PUBLIC_SITE_URL}/choosePricingPlan?welcomeEmail?true`,
                twitterFounderUrl: "https://twitter.com/timohuennebeck",
                twitterFounderTag: "@timohuennebeck",
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
