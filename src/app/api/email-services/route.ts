import { EmailTemplate, sendEmail } from "@/lib/email/emailService";
import { NextRequest as request, NextResponse as response } from "next/server";

export const POST = async (req: request) => {
    try {
        const { template, ...emailProps } = await req.json();

        // validate required fields
        if (!emailProps.userEmail || !emailProps.userFirstName) {
            return response.json({ error: "Missing required fields" }, { status: 400 });
        }

        // additional validation for paid plan template
        if (template === EmailTemplate.PAID_PLAN && !emailProps.purchasedPackage) {
            return response.json({ error: "Missing purchasedPackage field" }, { status: 400 });
        }

        const { data, error } = await sendEmail(template, emailProps);

        if (error) {
            return response.json({ error }, { status: 500 });
        }

        return response.json({ message: "Email has been sent", data }, { status: 200 });
    } catch (error) {
        console.error("Error in email service:", error);
        return response.json({ error: "Failed to send email" }, { status: 500 });
    }
};
