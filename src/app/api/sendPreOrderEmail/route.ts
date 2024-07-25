import { NextRequest as request, NextResponse as response } from "next/server";
import { Resend } from "resend";
import PreOrderEmailTemplate from "@/emails/PreOrderEmailTemplate";

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY ?? "");

export const POST = async (req: request) => {
    try {
        const { userEmail, userFullName, purchasedPackage } = await req.json();

        if (!userEmail || !userFullName || !purchasedPackage) {
            return response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: "info@updates.joinforj.com",
            to: userEmail,
            subject: `Pre-Order Confirmation - ${purchasedPackage}`,
            react: PreOrderEmailTemplate({
                userFullName,
                purchasedPackage,
                estimatedLaunchDate: "September 15, 2024",
                companyTitle: "Forj",
                twitterFounderUrl: "www.x.com/timohuennebeck",
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
