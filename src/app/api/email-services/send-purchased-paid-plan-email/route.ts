import { TextConstants } from "@/constants/TextConstants";
import PaidPlanEmailTemplate from "@/emails/PaidPlanEmailTemplate";
import { NextRequest as request, NextResponse as response } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_EMAIL_API_KEY ?? "");

export const POST = async (req: request) => {
    try {
        const { userEmail, userFirstName, purchasedPackage } = await req.json();

        if (!userEmail || !userFirstName || !purchasedPackage) {
            return response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: TextConstants.EMAIL__SEND_FROM,
            to: userEmail,
            subject: `Order Confirmation - ${purchasedPackage}`,
            react: PaidPlanEmailTemplate({
                userFirstName,
                purchasedPackage,
                gettingStartedLoomUrl: TextConstants.EMAIL__LOOM_GETTING_STARTED_URL,
                companyTitle: TextConstants.EMAIL__COMPANY_TITLE,
                twitterCompanyTag: TextConstants.EMAIL__TWITTER_COMPANY_TAG,
                twitterCompanyUrl: TextConstants.EMAIL__TWITTER_COMPANY_URL,
                twitterFounderTag: TextConstants.TEXT__TWITTER_FOUNDER_TAG,
                twitterFounderUrl: TextConstants.EMAIL__TWITTER_FOUNDER_URL,
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
